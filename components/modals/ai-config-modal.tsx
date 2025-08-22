"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Key, CheckCircle, AlertCircle, Loader2, ExternalLink, CreditCard, Zap } from "lucide-react"

interface AiConfigModalProps {
  children: React.ReactNode
  provider: 'openai' | 'claude' | 'gemini'
  onConfigSaved?: () => void
}

const aiProviderConfig = {
  openai: {
    name: 'OpenAI',
    description: 'Configure your OpenAI API key to use GPT-4 and other models for data analysis',
    color: 'green',
    icon: '🤖',
    fields: [
      { name: 'apiKey', label: 'API Key', placeholder: 'sk-...', type: 'password' },
      { name: 'organization', label: 'Organization ID (optional)', placeholder: 'org-...', type: 'text' },
      { name: 'model', label: 'Default Model', placeholder: 'gpt-4', type: 'text' }
    ],
    pricing: {
      inputCost: '$0.03 / 1K tokens',
      outputCost: '$0.06 / 1K tokens',
      estimatedCost: '~$0.15 per analysis'
    },
    docsUrl: 'https://platform.openai.com/api-keys',
    testEndpoint: '/api/ai/test/openai'
  },
  claude: {
    name: 'Claude (Anthropic)',
    description: 'Configure your Anthropic API key to use Claude for advanced data analysis',
    color: 'purple',
    icon: '🧠',
    fields: [
      { name: 'apiKey', label: 'API Key', placeholder: 'sk-ant-...', type: 'password' },
      { name: 'model', label: 'Default Model', placeholder: 'claude-3-sonnet-20240229', type: 'text' }
    ],
    pricing: {
      inputCost: '$0.015 / 1K tokens',
      outputCost: '$0.075 / 1K tokens',
      estimatedCost: '~$0.12 per analysis'
    },
    docsUrl: 'https://console.anthropic.com/',
    testEndpoint: '/api/ai/test/claude'
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Configure your Google AI Studio API key to use Gemini Pro for data insights',
    color: 'red',
    icon: '💎',
    fields: [
      { name: 'apiKey', label: 'API Key', placeholder: 'AIza...', type: 'password' },
      { name: 'model', label: 'Default Model', placeholder: 'gemini-1.5-pro', type: 'text' }
    ],
    pricing: {
      inputCost: '$0.00125 / 1K tokens',
      outputCost: '$0.005 / 1K tokens',
      estimatedCost: '~$0.08 per analysis'
    },
    docsUrl: 'https://aistudio.google.com/app/apikey',
    testEndpoint: '/api/ai/test/gemini'
  }
}

export function AiConfigModal({ children, provider, onConfigSaved }: AiConfigModalProps) {
  const [open, setOpen] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [testStatus, setTestStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const config = aiProviderConfig[provider]

  const handleTestConnection = async (formData: FormData) => {
    setTesting(true)
    setTestStatus({ type: null, message: '' })

    try {
      const data = Object.fromEntries(formData.entries())
      
      const response = await fetch(config.testEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setTestStatus({
          type: 'success',
          message: 'Connection successful! API key is valid and working.'
        })
      } else {
        setTestStatus({
          type: 'error',
          message: result.error || 'Connection failed. Please check your API key.'
        })
      }
    } catch (error) {
      setTestStatus({
        type: 'error',
        message: 'Failed to test connection. Please try again.'
      })
    } finally {
      setTesting(false)
    }
  }

  const handleSaveConfig = async (formData: FormData) => {
    setSaving(true)
    
    try {
      const data = Object.fromEntries(formData.entries())
      
      const response = await fetch('/api/ai/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          config: data
        }),
      })

      if (response.ok) {
        setTestStatus({
          type: 'success',
          message: 'Configuration saved successfully!'
        })
        
        if (onConfigSaved) {
          onConfigSaved()
        }

        setTimeout(() => {
          setOpen(false)
          setTestStatus({ type: null, message: '' })
        }, 2000)
      } else {
        const result = await response.json()
        setTestStatus({
          type: 'error',
          message: result.error || 'Failed to save configuration'
        })
      }
    } catch (error) {
      setTestStatus({
        type: 'error',
        message: 'An error occurred while saving the configuration'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`p-2 bg-${config.color}-500 rounded-lg`}>
              <Brain className="h-5 w-5 text-white" />
            </div>
            Configure {config.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                {config.name} Integration
              </CardTitle>
              <CardDescription>
                {config.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Pricing</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Input: {config.pricing.inputCost}</div>
                    <div>Output: {config.pricing.outputCost}</div>
                    <div className="font-medium">Est. cost: {config.pricing.estimatedCost}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Setup Guide</h4>
                  <a 
                    href={config.docsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                  >
                    Get API Key <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>

              {/* Comparison with Platform Option */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Compare with Wellspend AI</span>
                </div>
                <div className="text-sm text-blue-700">
                  Our platform option costs $0.02 per analysis and includes multi-model ensemble, 
                  cost optimization focus, and no API management. 
                  <span className="font-medium">Save ~{Math.round((parseFloat(config.pricing.estimatedCost.replace(/[^0-9.]/g, '')) - 0.02) / 0.02 * 100)}% vs {config.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleSaveConfig(formData)
                }}
                className="space-y-4"
              >
                {config.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required={!field.label.includes('optional')}
                    />
                  </div>
                ))}

                {/* Test Status */}
                {testStatus.message && (
                  <div className={`flex items-center gap-2 p-3 rounded-md ${
                    testStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {testStatus.type === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">{testStatus.message}</span>
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
                      handleTestConnection(formData)
                    }}
                    disabled={testing || saving}
                  >
                    {testing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={testing || saving}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={testing || saving || testStatus.type !== 'success'}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4 mr-2" />
                          Save Configuration
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
