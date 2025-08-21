"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface UploadDataModalProps {
  children: React.ReactNode
  onUploadComplete?: () => void
}

const dataCategories = [
  { id: "BILLING", name: "Billing & Costs" },
  { id: "HR", name: "Human Resources" },
  { id: "PRODUCTIVITY", name: "Productivity Metrics" },
  { id: "SOFTWARE", name: "Software Licenses" },
  { id: "OPERATIONS", name: "Operations" }
]

export function UploadDataModal({ children, onUploadComplete }: UploadDataModalProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleFileUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    const formData = new FormData(event.currentTarget)
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const dataSource = formData.get('dataSource') as string

    if (!file) {
      setUploadStatus({ type: 'error', message: 'Please select a file to upload' })
      setUploading(false)
      return
    }

    try {
      formData.append('dataSource', dataSource)
      formData.append('category', category)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Successfully uploaded and processed ${result.recordsProcessed} records`
        })
        // Reset form
        const form = event.target as HTMLFormElement
        form.reset()
        
        // Call completion callback
        if (onUploadComplete) {
          onUploadComplete()
        }
        
        // Close modal after delay
        setTimeout(() => {
          setOpen(false)
          setUploadStatus({ type: null, message: '' })
        }, 2000)
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Upload failed' })
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'An error occurred during upload' })
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement
      if (fileInput) {
        fileInput.files = files
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Data File
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFileUpload} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Data Category *</Label>
              <select
                name="category"
                id="category"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category...</option>
                {dataCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source *</Label>
              <select
                name="dataSource"
                id="dataSource"
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select source...</option>
                <option value="CSV_UPLOAD">CSV Upload</option>
                <option value="EXCEL_UPLOAD">Excel Upload</option>
                <option value="JSON_UPLOAD">JSON Upload</option>
                <option value="JIRA_EXPORT">Jira Export</option>
                <option value="AWS_EXPORT">AWS Export</option>
                <option value="MANUAL_ENTRY">Manual Entry</option>
              </select>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">Upload File *</Label>
            <Card
              className={`border-2 border-dashed transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <FileText className={`h-12 w-12 mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Drag and drop your file here, or{" "}
                    <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-500 cursor-pointer underline">
                      browse
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Supports CSV, JSON, Excel files up to 10MB
                  </p>
                </div>
                <Input
                  id="file-upload"
                  name="file"
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  className="hidden"
                  required
                />
              </CardContent>
            </Card>
          </div>

          {/* Upload Status */}
          {uploadStatus.message && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              uploadStatus.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{uploadStatus.message}</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
