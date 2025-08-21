"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { CheckCircle, Circle, DollarSign, TrendingUp, Clock } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: string
  potentialSavings: number | null
  estimatedEffort: string
  actionItems: string[]
  isImplemented: boolean
}

export function RecommendationsList() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("/api/data/recommendations")
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data)
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleImplementation = async (id: string, isImplemented: boolean) => {
    try {
      const response = await fetch("/api/data/recommendations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, isImplemented: !isImplemented }),
      })

      if (response.ok) {
        setRecommendations(recommendations.map(rec => 
          rec.id === id ? { ...rec, isImplemented: !isImplemented } : rec
        ))
      }
    } catch (error) {
      console.error("Failed to update recommendation:", error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "cost-optimization":
        return <DollarSign className="h-4 w-4" />
      case "productivity":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div>Loading recommendations...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Optimization Recommendations</h3>
        <div className="text-sm text-gray-500">
          {recommendations.filter(r => !r.isImplemented).length} active recommendations
        </div>
      </div>

      {recommendations.map((recommendation) => (
        <Card key={recommendation.id} className={recommendation.isImplemented ? "opacity-75" : ""}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(recommendation.category)}
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {recommendation.priority}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleImplementation(recommendation.id, recommendation.isImplemented)}
                className="flex items-center space-x-1"
              >
                {recommendation.isImplemented ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span>{recommendation.isImplemented ? "Implemented" : "Mark Complete"}</span>
              </Button>
            </div>
            <CardDescription>{recommendation.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {recommendation.potentialSavings && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Potential savings: <strong>{formatCurrency(recommendation.potentialSavings)}/month</strong>
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">
                  Effort: <strong>{recommendation.estimatedEffort}</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm">
                  Category: <strong>{recommendation.category.replace("-", " ")}</strong>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Action Items:</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {recommendation.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {recommendations.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No recommendations available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 