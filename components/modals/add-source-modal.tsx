"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Cloud, Settings, CheckCircle, AlertCircle, Loader2, Key, Globe } from "lucide-react"

interface AddSourceModalProps {
  children: React.ReactNode
  onSourceAdded?: () => void
}

const integrationTypes = [
  {
    id: 'jira',
    name: 'Jira',
    description: 'Connect your Jira instance to track productivity metrics',
    icon: Settings,
    category: 'productivity',
    fields: [
      { name: 'url', label: 'Jira URL', placeholder: 'https://yourcompany.atlassian.net', type: 'url' },
      { name: 'email', label: 'Email', placeholder: 'your-email@company.com', type: 'email' },
      { name: 'apiToken', label: 'API Token', placeholder: 'Your Jira API token', type: 'password' },
      { name: 'projectKey', label: 'Project Key (optional)', placeholder: 'PROJ', type: 'text' }
    ]
  },
  {
    id: 'aws',
    name: 'AWS Billing',
    description: 'Connect to AWS Cost Explorer and billing data',
    icon: Cloud,
    category: 'billing',
    fields: [
      { name: 'accessKeyId', label: 'Access Key ID', placeholder: 'AKIA...', type: 'text' },
      { name: 'secretAccessKey', label: 'Secret Access Key', placeholder: 'Your AWS secret key', type: 'password' },
      { name: 'region', label: 'AWS Region', placeholder: 'us-east-1', type: 'text' },
      { name: 'accountId', label: 'Account ID (optional)', placeholder: '123456789012', type: 'text' }
    ]
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Connect Notion databases for team productivity tracking',
    icon: Database,
    category: 'productivity',
    fields: [
      { name: 'apiToken', label: 'Integration Token', placeholder: 'secret_...', type: 'password' },
      { name: 'databaseId', label: 'Database ID', placeholder: 'Database ID from URL', type: 'text' }
    ]
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect GitHub for development productivity metrics',
    icon: Globe,
    category: 'productivity',
    fields: [
      { name: 'token', label: 'Personal Access Token', placeholder: 'ghp_...', type: 'password' },
      { name: 'organization', label: 'Organization', placeholder: 'your-org', type: 'text' },
      { name: 'repositories', label: 'Repositories (comma-separated)', placeholder: 'repo1,repo2', type: 'text' }
    ]
  }
]

export function AddSourceModal({ children, onSourceAdded }: AddSourceModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedIntegration, setSelectedIntegration] = useState('')
  const [connecting, setConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleTestConnection = async (formData: FormData, integrationType: string) => {
    setConnecting(true)
    setConnectionStatus({ type: null, message: '' })

    try {
      const data = Object.fromEntries(formData.entries())
      
      // Mock connection test - replace with actual API calls
      const response = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: integrationType,
          config: data
        }),
      })

      if (response.ok) {
        setConnectionStatus({
          type: 'success',
          message: 'Connection successful! You can now save this integration.'
        })
      } else {
        const result = await response.json()
        setConnectionStatus({
          type: 'error',
          message: result.error || 'Connection failed. Please check your credentials.'
        })
      }
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        message: 'Failed to test connection. Please try again.'
      })
    } finally {
      setConnecting(false)
    }
  }

  const handleSaveIntegration = async (formData: FormData, integrationType: string) => {
    setConnecting(true)
    
    try {
      const data = Object.fromEntries(formData.entries())
      
      const response = await fetch('/api/integrations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: integrationType,
          config: data,
          name: data.name || `${integrationType} Integration`
        }),
      })

      if (response.ok) {
        setConnectionStatus({
          type: 'success',
          message: 'Integration saved successfully!'
        })
        
        if (onSourceAdded) {
          onSourceAdded()
        }

        setTimeout(() => {
          setOpen(false)
          setConnectionStatus({ type: null, message: '' })
          setSelectedIntegration('')
        }, 2000)
      } else {
        const result = await response.json()
        setConnectionStatus({
          type: 'error',
          message: result.error || 'Failed to save integration'
        })
      }
    } catch (error) {
      setConnectionStatus({
        type: 'error',
        message: 'An error occurred while saving the integration'
      })
    } finally {
      setConnecting(false)
    }
  }

  const selectedIntegrationConfig = integrationTypes.find(i => i.id === selectedIntegration)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Add Data Source
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedIntegration} onValueChange={setSelectedIntegration} className="w-full">
          <TabsList className="tabs-list-green grid grid-cols-2 lg:grid-cols-4 mb-6">
            {integrationTypes.map((integration) => {
              const IconComponent = integration.icon
              return (
                <TabsTrigger key={integration.id} value={integration.id} className="tabs-trigger-green flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  {integration.name}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {integrationTypes.map((integration) => {
            const IconComponent = integration.icon
            return (
              <TabsContent key={integration.id} value={integration.id} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="h-5 w-5" />
                      Connect {integration.name}
                    </CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleSaveIntegration(formData, integration.id)
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="integration-name">Integration Name</Label>
                        <Input
                          id="integration-name"
                          name="name"
                          placeholder={`My ${integration.name} Integration`}
                          required
                        />
                      </div>

                      {integration.fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name}>
                            {field.label}
                            {field.type === 'password' && <Key className="inline h-3 w-3 ml-1" />}
                          </Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            required={!field.label.includes('optional')}
                          />
                        </div>
                      ))}

                      {/* Connection Status */}
                      {connectionStatus.message && (
                        <div className={`flex items-center gap-2 p-3 rounded-md ${
                          connectionStatus.type === 'success' 
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                          {connectionStatus.type === 'success' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          <span className="text-sm">{connectionStatus.message}</span>
                        </div>
                      )}

                      <div className="flex justify-between pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault()
                            const form = e.currentTarget.closest('form') as HTMLFormElement
                            const formData = new FormData(form)
                            handleTestConnection(formData, integration.id)
                          }}
                          disabled={connecting}
                        >
                          {connecting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            'Test Connection'
                          )}
                        </Button>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={connecting}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            disabled={connecting || connectionStatus.type !== 'success'}
                          >
                            {connecting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Database className="h-4 w-4 mr-2" />
                                Save Integration
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
