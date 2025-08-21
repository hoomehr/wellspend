"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface ProductivityChartProps {
  data: Array<{
    date: string
    completed: number
    created: number
  }>
  score: number
  detailed?: boolean
}

export function ProductivityChart({ data, score, detailed = false }: ProductivityChartProps) {
  // Take last 7 days for overview, all data for detailed view
  const chartData = detailed ? data : data.slice(-7)

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{new Date(props.label).toLocaleDateString()}</p>
          <p className="text-green-600">
            Completed: {props.payload[0].value}
          </p>
          <p className="text-blue-600">
            Created: {props.payload[1].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={`space-y-6 ${detailed ? "col-span-2" : ""}`}>
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>
            Daily task creation vs completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip content={renderTooltip} />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="created" fill="#3b82f6" name="Created" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Productivity Score</CardTitle>
          <CardDescription>
            Overall team productivity rating
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">{score}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Based on task completion rate, response time, and quality metrics
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 