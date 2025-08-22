"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, DollarSign, Users, Cloud, CheckCircle, AlertCircle } from "lucide-react"

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
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
        ;(event.target as HTMLFormElement).reset()
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Upload failed' })
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Network error occurred' })
    } finally {
      setUploading(false)
    }
  }

  const dataCategories = [
    {
      id: 'billing',
      name: 'Billing & Invoices',
      description: 'Monthly bills, invoices, vendor payments',
      icon: DollarSign,
      examples: ['AWS billing CSV', 'Office 365 invoices', 'Vendor bills']
    },
    {
      id: 'hr',
      name: 'HR & Payroll',
      description: 'Employee costs, benefits, payroll data',
      icon: Users,
      examples: ['Payroll exports', 'Benefits costs', 'Contractor payments']
    },
    {
      id: 'productivity',
      name: 'Productivity Data',
      description: 'Task management, project tracking',
      icon: FileText,
      examples: ['Jira exports', 'GitHub activity', 'Time tracking']
    },
    {
      id: 'cloud-costs',
      name: 'Cloud Infrastructure',
      description: 'Cloud provider billing and usage',
      icon: Cloud,
      examples: ['AWS Cost Explorer', 'Azure billing', 'GCP usage reports']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Data Upload</h1>
        <div className="text-sm text-gray-500">
          Upload CSV/JSON files to analyze costs and productivity
        </div>
      </div>

      {uploadStatus.type && (
        <div className={`p-4 rounded-md flex items-center space-x-2 ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {uploadStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{uploadStatus.message}</span>
        </div>
      )}

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="tabs-list-green">
          <TabsTrigger value="upload" className="tabs-trigger-green">Upload Data</TabsTrigger>
          <TabsTrigger value="templates" className="tabs-trigger-green">Data Templates</TabsTrigger>
          <TabsTrigger value="history" className="tabs-trigger-green">Upload History</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Upload File</span>
              </CardTitle>
              <CardDescription>
                Upload CSV or JSON files containing your cost and productivity data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Data Category</Label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category...</option>
                    {dataCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataSource">Data Source</Label>
                  <select
                    name="dataSource"
                    id="dataSource"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select source...</option>
                    <option value="CSV_UPLOAD">CSV Upload</option>
                    <option value="JIRA_API">Jira Export</option>
                    <option value="NOTION_API">Notion Export</option>
                    <option value="AWS_BILLING">AWS Billing</option>
                    <option value="MANUAL_ENTRY">Manual Entry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".csv,.json"
                    required
                    disabled={uploading}
                  />
                  <p className="text-sm text-gray-500">
                    Accepted formats: CSV, JSON (max 10MB)
                  </p>
                </div>

                <Button type="submit" disabled={uploading} className="w-full">
                  {uploading ? 'Uploading...' : 'Upload and Process'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span>{category.name}</span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Example data sources:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.examples.map((example, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>
                View your recent data uploads and processing status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No uploads yet</p>
                <p className="text-sm">Upload your first file to see history here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 