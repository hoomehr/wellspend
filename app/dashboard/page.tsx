"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MetricsCards } from "@/components/dashboard/metrics-cards"
import { CostChart } from "@/components/dashboard/cost-chart"
import { ProductivityChart } from "@/components/dashboard/productivity-chart"
import { RecommendationsList } from "@/components/dashboard/recommendations-list"

interface DashboardData {
  totalCosts: number
  cloudCosts: number
  hrCosts: number
  productivityScore: number
  taskCompletion: number
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

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/data/aggregate")
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        setError("Failed to load dashboard data")
      }
    } catch (err) {
      setError("Error loading dashboard data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <MetricsCards
        totalCosts={data.totalCosts}
        cloudCosts={data.cloudCosts}
        hrCosts={data.hrCosts}
        productivityScore={data.productivityScore}
        taskCompletion={data.taskCompletion}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostChart 
              data={data.monthlyTrend}
              breakdown={data.costBreakdown}
            />
            <ProductivityChart 
              data={data.productivityTrend}
              score={data.productivityScore}
            />
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <CostChart 
            data={data.monthlyTrend}
            breakdown={data.costBreakdown}
            detailed={true}
          />
        </TabsContent>

        <TabsContent value="productivity" className="space-y-4">
          <ProductivityChart 
            data={data.productivityTrend}
            score={data.productivityScore}
            detailed={true}
          />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <RecommendationsList />
        </TabsContent>
      </Tabs>
    </div>
  )
} 