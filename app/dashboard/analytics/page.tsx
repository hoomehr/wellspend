"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CostChart } from "@/components/dashboard/cost-chart"
import { ProductivityChart } from "@/components/dashboard/productivity-chart"
import { BarChart3, TrendingUp, Filter, Download, Calendar } from "lucide-react"

interface AnalyticsData {
  monthlyTrend: Array<{
    month: string
    cost: number
    productivity: number
  }>
  costBreakdown: {
    labels: string[]
    data: number[]
  }
  productivityTrend: Array<{
    date: string
    completed: number
    created: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")
  const [department, setDepartment] = useState("all")

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange, department])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/data/aggregate?period=${timeRange}&department=${department}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting analytics data...')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="operations">Operations</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric Type</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <option value="all">All Metrics</option>
                <option value="costs">Costs Only</option>
                <option value="productivity">Productivity Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cost-analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cost-analysis">Cost Analysis</TabsTrigger>
          <TabsTrigger value="productivity">Productivity Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Department Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="cost-analysis" className="space-y-6">
          {data && (
            <CostChart 
              data={data.monthlyTrend}
              breakdown={data.costBreakdown}
              detailed={true}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">92.3%</div>
                <p className="text-sm text-gray-600">Cost optimization achieved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Largest Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Cloud Infrastructure</div>
                <p className="text-sm text-gray-600">$12,500/month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Potential Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">$2,400</div>
                <p className="text-sm text-gray-600">Identified this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-6">
          {data && (
            <ProductivityChart 
              data={data.productivityTrend}
              score={87.5}
              detailed={true}
            />
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Story Points/Sprint</span>
                    <span className="font-bold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cycle Time</span>
                    <span className="font-bold">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deployment Frequency</span>
                    <span className="font-bold">2.1/week</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Bug Rate</span>
                    <span className="font-bold text-green-600">2.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Code Coverage</span>
                    <span className="font-bold">84%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time to Resolution</span>
                    <span className="font-bold">4.5 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trend Analysis</span>
              </CardTitle>
              <CardDescription>
                Key trends and patterns in your cost and productivity data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Cost Trends</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Cloud costs decreased 12% this quarter</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Software licenses increased 8%</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>HR costs stable with 2% growth</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Productivity Trends</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Task completion rate improved 15%</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Cycle time reduced by 1.2 days</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Code review time increased</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>
                Compare costs and productivity across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Department</th>
                        <th className="text-right p-2">Monthly Cost</th>
                        <th className="text-right p-2">Productivity Score</th>
                        <th className="text-right p-2">Efficiency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Engineering</td>
                        <td className="p-2 text-right">$24,500</td>
                        <td className="p-2 text-right">89%</td>
                        <td className="p-2 text-right text-green-600">High</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Marketing</td>
                        <td className="p-2 text-right">$12,300</td>
                        <td className="p-2 text-right">76%</td>
                        <td className="p-2 text-right text-yellow-600">Medium</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Sales</td>
                        <td className="p-2 text-right">$8,900</td>
                        <td className="p-2 text-right">92%</td>
                        <td className="p-2 text-right text-green-600">High</td>
                      </tr>
                      <tr>
                        <td className="p-2">Operations</td>
                        <td className="p-2 text-right">$6,200</td>
                        <td className="p-2 text-right">84%</td>
                        <td className="p-2 text-right text-green-600">High</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 