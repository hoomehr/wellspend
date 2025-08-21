"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Settings, User, Shield, Database, Bell, Zap, Brain, CreditCard } from "lucide-react"

export default function SettingsPage() {
  const [integrations, setIntegrations] = useState({
    jira: false,
    notion: false,
    aws: false,
    slack: false
  })

  const [aiIntegrations, setAiIntegrations] = useState({
    openai: { enabled: false, configured: false },
    claude: { enabled: false, configured: false },
    gemini: { enabled: false, configured: false },
    platform: { enabled: true, configured: true } // Pay-as-you-go option
  })

  const [notifications, setNotifications] = useState({
    email: true,
    costAlerts: true,
    weeklyReports: true,
    recommendations: true
  })

  const handleIntegrationToggle = (integration: string) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration as keyof typeof prev]
    }))
  }

  const handleNotificationToggle = (notification: string) => {
    setNotifications(prev => ({
      ...prev,
      [notification]: !prev[notification as keyof typeof prev]
    }))
  }

  const handleAiIntegrationToggle = (provider: string) => {
    setAiIntegrations(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        enabled: !prev[provider as keyof typeof prev].enabled
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <div className="text-sm text-gray-500">
          Configure your Wellspend preferences and integrations
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@wellspend.local" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="ADMIN">Admin</option>
                    <option value="FINANCE">Finance</option>
                    <option value="OPS">Operations</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
              <Button className="w-full md:w-auto">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>External Integrations</span>
              </CardTitle>
              <CardDescription>
                Connect Wellspend with your existing tools and services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">Jira Integration</h3>
                    <p className="text-sm text-gray-600">Connect to track productivity metrics</p>
                  </div>
                  <Switch
                    checked={integrations.jira}
                    onCheckedChange={() => handleIntegrationToggle('jira')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">Notion Integration</h3>
                    <p className="text-sm text-gray-600">Sync documentation and team metrics</p>
                  </div>
                  <Switch
                    checked={integrations.notion}
                    onCheckedChange={() => handleIntegrationToggle('notion')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">AWS Billing</h3>
                    <p className="text-sm text-gray-600">Import cloud infrastructure costs</p>
                  </div>
                  <Switch
                    checked={integrations.aws}
                    onCheckedChange={() => handleIntegrationToggle('aws')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">Slack Notifications</h3>
                    <p className="text-sm text-gray-600">Receive alerts and reports in Slack</p>
                  </div>
                  <Switch
                    checked={integrations.slack}
                    onCheckedChange={() => handleIntegrationToggle('slack')}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline">Configure API Keys</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose when and how you receive updates from Wellspend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive general updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Cost Alerts</h3>
                    <p className="text-sm text-gray-600">Get notified when costs exceed thresholds</p>
                  </div>
                  <Switch
                    checked={notifications.costAlerts}
                    onCheckedChange={() => handleNotificationToggle('costAlerts')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Weekly Reports</h3>
                    <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={() => handleNotificationToggle('weeklyReports')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Recommendations</h3>
                    <p className="text-sm text-gray-600">Get notified about new optimization recommendations</p>
                  </div>
                  <Switch
                    checked={notifications.recommendations}
                    onCheckedChange={() => handleNotificationToggle('recommendations')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your account security and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Change Password</h3>
                  <div className="space-y-2">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button variant="outline">Update Password</Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Active Sessions</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    View and manage your active login sessions
                  </p>
                  <Button variant="outline">View Sessions</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>
                Manage your data retention and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Data Retention</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure how long your data is stored
                  </p>
                  <select className="w-full md:w-auto p-2 border border-gray-300 rounded-md">
                    <option value="6months">6 Months</option>
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all your data in a portable format
                  </p>
                  <Button variant="outline">Request Data Export</Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2 text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 