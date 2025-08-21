import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { TrendingUp, TrendingDown, DollarSign, Activity, Target, Cloud } from "lucide-react"

interface MetricsCardsProps {
  totalCosts: number
  cloudCosts: number
  hrCosts: number
  productivityScore: number
  taskCompletion: number
}

export function MetricsCards({
  totalCosts,
  cloudCosts,
  hrCosts,
  productivityScore,
  taskCompletion,
}: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Monthly Costs",
      value: formatCurrency(totalCosts),
      change: -5.2,
      icon: DollarSign,
      description: "vs last month",
    },
    {
      title: "Cloud Infrastructure",
      value: formatCurrency(cloudCosts),
      change: -12.1,
      icon: Cloud,
      description: "AWS, Azure, GCP",
    },
    {
      title: "Productivity Score",
      value: `${formatNumber(productivityScore)}%`,
      change: 8.3,
      icon: Activity,
      description: "team efficiency",
    },
    {
      title: "Task Completion",
      value: `${formatNumber(taskCompletion)}%`,
      change: 4.7,
      icon: Target,
      description: "on-time delivery",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const isPositive = metric.change > 0
        const Icon = metric.icon
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="ml-1">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 