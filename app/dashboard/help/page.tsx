import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Shield, 
  Upload, 
  BarChart3, 
  Settings,
  ExternalLink,
  Download
} from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I upload my cost data?",
      answer: "Navigate to the 'Data Upload' page, select your data category (billing, HR, productivity, etc.), choose the data source, and upload your CSV or JSON file. The system will automatically process and categorize your data."
    },
    {
      question: "What file formats are supported?",
      answer: "Wellspend supports CSV files with headers and JSON files (both arrays and objects). Files can be up to 10MB in size. The system automatically maps common field names like 'amount', 'cost', 'date', etc."
    },
    {
      question: "How are recommendations generated?",
      answer: "Recommendations are generated based on analysis of your uploaded data, identifying patterns in spending, productivity metrics, and comparing against best practices. The system looks for cost optimization opportunities and efficiency improvements."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, Wellspend is designed with privacy-first principles. All data stays within your infrastructure, passwords are securely hashed, sensitive data is encrypted, and no information is sent to external servers without your explicit approval."
    },
    {
      question: "Can I integrate with external tools?",
      answer: "Yes, Wellspend includes connectors for popular tools like Jira (productivity metrics), Notion (documentation tracking), and AWS (cloud billing). All integrations use API keys stored locally in your environment variables."
    },
    {
      question: "How do I set up integrations?",
      answer: "Go to Settings > Integrations, enable the desired integration, then add your API credentials to the .env.local file. Each integration includes setup instructions and required permissions."
    }
  ]

  const quickStartGuide = [
    {
      step: 1,
      title: "Upload Your First Dataset",
      description: "Start by uploading a CSV file with your billing or productivity data",
      icon: Upload
    },
    {
      step: 2,
      title: "Review Dashboard Metrics",
      description: "Check the dashboard to see your data visualized in charts and metrics cards",
      icon: BarChart3
    },
    {
      step: 3,
      title: "Configure Integrations",
      description: "Set up API connections to automatically sync data from your tools",
      icon: Settings
    },
    {
      step: 4,
      title: "Review Recommendations",
      description: "Implement cost optimization and productivity improvement suggestions",
      icon: HelpCircle
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Help & Documentation</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Docs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-4">
        <TabsList className="tabs-list-green">
          <TabsTrigger value="getting-started" className="tabs-trigger-green">Getting Started</TabsTrigger>
          <TabsTrigger value="faq" className="tabs-trigger-green">FAQ</TabsTrigger>
          <TabsTrigger value="privacy" className="tabs-trigger-green">Privacy & Security</TabsTrigger>
          <TabsTrigger value="support" className="tabs-trigger-green">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Quick Start Guide</span>
              </CardTitle>
              <CardDescription>
                Get up and running with Wellspend in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quickStartGuide.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.step} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{item.step}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Templates</CardTitle>
                <CardDescription>
                  Download sample CSV templates to get started quickly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  AWS Billing Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Jira Export Template
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Payroll Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch step-by-step video guides
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Setting Up Your First Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Configuring Integrations
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Understanding Recommendations
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers about using Wellspend
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-medium mb-2 text-gray-900">{faq.question}</h3>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
              <CardDescription>
                How Wellspend protects your data and ensures privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Data Privacy Principles</h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• All data stays within your infrastructure</li>
                    <li>• No external API calls without your approval</li>
                    <li>• Sensitive data encrypted at rest</li>
                    <li>• Role-based access control</li>
                    <li>• Complete audit trail of all actions</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Security Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Secure password hashing with bcrypt</li>
                    <li>• Session-based authentication</li>
                    <li>• HTTPS/TLS encryption in transit</li>
                    <li>• Container-based deployment isolation</li>
                    <li>• Environment variable configuration</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Compliance</h3>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• GDPR-friendly architecture</li>
                    <li>• Data portability support</li>
                    <li>• Configurable data retention</li>
                    <li>• Right to deletion</li>
                    <li>• Privacy by design</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5" />
                <span>Get Support</span>
              </CardTitle>
              <CardDescription>
                Need help? Here are the best ways to get assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Documentation</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Comprehensive guides and API documentation
                    </p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Docs
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">GitHub Issues</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Report bugs or request features
                    </p>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Issue
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">System Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Version:</span> 1.0.0
                      </div>
                      <div>
                        <span className="font-medium">Environment:</span> Development
                      </div>
                      <div>
                        <span className="font-medium">Database:</span> SQLite
                      </div>
                      <div>
                        <span className="font-medium">Node.js:</span> 18+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 