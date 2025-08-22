"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CostChart } from "@/components/dashboard/cost-chart"
import { ProductivityChart } from "@/components/dashboard/productivity-chart"
import { 
  BarChart3, TrendingUp, Filter, Download, Calendar, Brain, Settings2, 
  Target, Zap, AlertTriangle, CheckCircle, TrendingDown, Lightbulb,
  Cpu, DollarSign, Users, Clock, Activity, ArrowUp, ArrowDown, Minus,
  PieChart, LineChart, BarChart, RefreshCw
} from "lucide-react"

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

interface AnalyticsTechnique {
  id: string
  name: string
  description: string
  icon: any
  category: 'cost' | 'productivity' | 'predictive' | 'behavioral'
  enabled: boolean
  config: {
    threshold?: number
    sensitivity?: 'low' | 'medium' | 'high'
    frequency?: 'daily' | 'weekly' | 'monthly'
    [key: string]: any
  }
}

interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'cost' | 'productivity' | 'efficiency' | 'quality'
  priority: number
  estimatedSavings?: string
  effort: 'low' | 'medium' | 'high'
  timeline: string
  techniques: string[]
  action?: {
    label: string
    type: 'primary' | 'secondary'
  }
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("6months")
  const [department, setDepartment] = useState("all")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  // Analytics Techniques Configuration
  const [analyticsTechniques, setAnalyticsTechniques] = useState<AnalyticsTechnique[]>([
    {
      id: 'cost-anomaly',
      name: 'Cost Anomaly Detection',
      description: 'Detect unusual spikes or patterns in spending using statistical analysis',
      icon: AlertTriangle,
      category: 'cost',
      enabled: true,
      config: { threshold: 15, sensitivity: 'medium', frequency: 'daily' }
    },
    {
      id: 'trend-forecasting',
      name: 'Predictive Trend Analysis',
      description: 'Forecast future costs and productivity using machine learning models',
      icon: TrendingUp,
      category: 'predictive',
      enabled: true,
      config: { horizon: '3months', confidence: 85 }
    },
    {
      id: 'efficiency-scoring',
      name: 'Team Efficiency Scoring',
      description: 'Calculate efficiency scores based on output vs. resource consumption',
      icon: Target,
      category: 'productivity',
      enabled: true,
      config: { weightCost: 40, weightOutput: 60, frequency: 'weekly' }
    },
    {
      id: 'benchmark-comparison',
      name: 'Industry Benchmark Analysis',
      description: 'Compare your metrics against industry standards and best practices',
      icon: BarChart,
      category: 'cost',
      enabled: false,
      config: { industry: 'tech', size: 'medium', updateFreq: 'monthly' }
    },
    {
      id: 'resource-optimization',
      name: 'Resource Utilization Analysis',
      description: 'Identify underutilized resources and optimization opportunities',
      icon: Cpu,
      category: 'cost',
      enabled: true,
      config: { utilizationThreshold: 70, frequency: 'weekly' }
    },
    {
      id: 'behavioral-patterns',
      name: 'Team Behavior Analytics',
      description: 'Analyze work patterns, collaboration, and productivity behaviors',
      icon: Users,
      category: 'behavioral',
      enabled: false,
      config: { trackMeetings: true, trackDeployments: true, sensitivity: 'medium' }
    },
    {
      id: 'roi-analysis',
      name: 'ROI Impact Analysis',
      description: 'Measure return on investment for tools, processes, and initiatives',
      icon: DollarSign,
      category: 'cost',
      enabled: true,
      config: { minInvestment: 1000, timeframe: '6months' }
    },
    {
      id: 'quality-correlation',
      name: 'Quality-Cost Correlation',
      description: 'Analyze relationships between code quality metrics and operational costs',
      icon: Activity,
      category: 'productivity',
      enabled: false,
      config: { qualityMetrics: ['bugs', 'coverage', 'complexity'] }
    }
  ])

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange, department])

  useEffect(() => {
    generateRecommendations()
  }, [analyticsTechniques, data])

  const toggleTechnique = (techniqueId: string) => {
    setAnalyticsTechniques(prev => 
      prev.map(tech => 
        tech.id === techniqueId 
          ? { ...tech, enabled: !tech.enabled }
          : tech
      )
    )
  }

  const updateTechniqueConfig = (techniqueId: string, configKey: string, value: any) => {
    setAnalyticsTechniques(prev =>
      prev.map(tech =>
        tech.id === techniqueId
          ? { ...tech, config: { ...tech.config, [configKey]: value } }
          : tech
      )
    )
  }

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

  const generateRecommendations = async () => {
    if (!data) return

    setLoadingRecommendations(true)
    const enabledTechniques = analyticsTechniques.filter(tech => tech.enabled)
    
    // Simulate AI-powered recommendation generation
    const generatedRecommendations: Recommendation[] = []

    enabledTechniques.forEach(technique => {
      switch (technique.id) {
        case 'cost-anomaly':
          generatedRecommendations.push({
            id: 'cost-spike-alert',
            title: 'Cloud Infrastructure Cost Spike Detected',
            description: 'Your cloud costs increased by 23% this week, primarily due to increased EC2 usage in the us-east-1 region.',
            impact: 'high',
            category: 'cost',
            priority: 1,
            estimatedSavings: '$3,200/month',
            effort: 'medium',
            timeline: '1-2 weeks',
            techniques: ['cost-anomaly'],
            action: { label: 'Review Resources', type: 'primary' }
          })
          break
          
        case 'trend-forecasting':
          generatedRecommendations.push({
            id: 'forecasted-increase',
            title: 'Predicted 15% Cost Increase Next Quarter',
            description: 'Based on current trends, your total costs are projected to increase by 15% in Q2. Consider scaling optimizations now.',
            impact: 'medium',
            category: 'cost',
            priority: 3,
            estimatedSavings: '$5,400/quarter',
            effort: 'high',
            timeline: '4-6 weeks',
            techniques: ['trend-forecasting'],
            action: { label: 'Plan Budget', type: 'secondary' }
          })
          break

        case 'efficiency-scoring':
          generatedRecommendations.push({
            id: 'team-efficiency-low',
            title: 'Engineering Team Efficiency Below Target',
            description: 'Engineering team efficiency score is 76%, below the target of 85%. High meeting time and context switching identified.',
            impact: 'high',
            category: 'productivity',
            priority: 2,
            effort: 'medium',
            timeline: '2-3 weeks',
            techniques: ['efficiency-scoring'],
            action: { label: 'Optimize Schedule', type: 'primary' }
          })
          break

        case 'resource-optimization':
          generatedRecommendations.push({
            id: 'underutilized-resources',
            title: 'Underutilized Development Tools Detected',
            description: 'Several software licenses show <40% utilization. Consider downsizing or reassigning licenses.',
            impact: 'medium',
            category: 'cost',
            priority: 4,
            estimatedSavings: '$1,800/month',
            effort: 'low',
            timeline: '1 week',
            techniques: ['resource-optimization'],
            action: { label: 'Audit Licenses', type: 'primary' }
          })
          break

        case 'roi-analysis':
          generatedRecommendations.push({
            id: 'tool-roi-negative',
            title: 'Low ROI on Recent Tool Investment',
            description: 'The new project management tool shows limited adoption and negative ROI after 3 months.',
            impact: 'medium',
            category: 'efficiency',
            priority: 5,
            effort: 'low',
            timeline: '2 weeks',
            techniques: ['roi-analysis'],
            action: { label: 'Review Tool Usage', type: 'secondary' }
          })
          break
      }
    })

    // Add some general recommendations based on data patterns
    if (data.monthlyTrend.length > 3) {
      const latestCost = data.monthlyTrend[data.monthlyTrend.length - 1].cost
      const previousCost = data.monthlyTrend[data.monthlyTrend.length - 2].cost
      
      if (latestCost > previousCost * 1.1) {
        generatedRecommendations.push({
          id: 'general-cost-increase',
          title: 'Monthly Cost Increase Detected',
          description: 'Overall costs increased by more than 10% compared to last month. Review recent changes and spending patterns.',
          impact: 'medium',
          category: 'cost',
          priority: 6,
          effort: 'low',
          timeline: '1 week',
          techniques: ['general'],
          action: { label: 'Investigate', type: 'secondary' }
        })
      }
    }

    // Sort by priority and limit to top 6 recommendations
    const sortedRecs = generatedRecommendations
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 6)

    setRecommendations(sortedRecs)
    setLoadingRecommendations(false)
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'  
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-red-50 text-red-700'
      case 'medium': return 'bg-yellow-50 text-yellow-700'
      case 'low': return 'bg-green-50 text-green-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cost': return <DollarSign className="h-4 w-4" />
      case 'productivity': return <Activity className="h-4 w-4" />
      case 'predictive': return <Brain className="h-4 w-4" />
      case 'behavioral': return <Users className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
            {/* Header Section */}
      <div className="gradient-green rounded-lg p-6 text-white card">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-green-100">AI-powered insights and configurable analytics techniques</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={exportData} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
            <Button onClick={() => generateRecommendations()} disabled={loadingRecommendations} className="bg-white text-green-600 hover:bg-green-50">
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingRecommendations ? 'animate-spin' : ''}`} />
              Refresh AI Insights
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Techniques</p>
                <p className="text-2xl font-bold">{analyticsTechniques.filter(t => t.enabled).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Recommendations</p>
                <p className="text-2xl font-bold">{recommendations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Potential Savings</p>
                <p className="text-2xl font-bold">$12.4K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Efficiency Score</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Analysis Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <label className="text-sm font-medium">Analysis Focus</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <option value="all">All Metrics</option>
                <option value="costs">Cost Optimization</option>
                <option value="productivity">Productivity Focus</option>
                <option value="predictive">Predictive Analysis</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Model</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <option value="ensemble">Multi-Model Ensemble</option>
                <option value="cost-optimized">Cost-Optimized Model</option>
                <option value="productivity-focused">Productivity Model</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-green-600" />
              <span>AI-Powered Recommendations</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {recommendations.filter(r => r.impact === 'high').length} High Priority
              </Badge>
              <Button 
                size="sm" 
                onClick={() => generateRecommendations()} 
                disabled={loadingRecommendations}
                className="bg-green-600 hover:bg-green-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingRecommendations ? 'animate-spin' : ''}`} />
                Generate New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
                <span className="text-gray-600">Analyzing data with AI...</span>
              </div>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getImpactColor(rec.impact)}`}>
                        {rec.category === 'cost' && <DollarSign className="h-3 w-3" />}
                        {rec.category === 'productivity' && <Activity className="h-3 w-3" />}
                        {rec.category === 'efficiency' && <Target className="h-3 w-3" />}
                        {rec.category === 'quality' && <CheckCircle className="h-3 w-3" />}
                      </div>
                      <Badge className={getImpactColor(rec.impact)}>
                        {rec.impact.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      {rec.estimatedSavings && (
                        <div className="text-sm font-semibold text-green-600">
                          {rec.estimatedSavings}
                        </div>
                      )}
                      <div className={`text-xs px-2 py-1 rounded ${getEffortColor(rec.effort)}`}>
                        {rec.effort} effort
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>⏱️ {rec.timeline}</span>
                      <span>🔬 {rec.techniques.length} technique(s)</span>
                    </div>
                    {rec.action && (
                      <Button 
                        size="sm" 
                        variant={rec.action.type === 'primary' ? 'default' : 'outline'}
                        className="h-8"
                      >
                        {rec.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recommendations available. Enable analytics techniques and refresh to generate insights.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analytics Techniques Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings2 className="h-5 w-5 text-green-600" />
            <span>Analytics Techniques</span>
          </CardTitle>
          <CardDescription>
            Configure which analytics techniques to apply to your data. Each technique generates specific insights and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsTechniques.map((technique) => {
              const IconComponent = technique.icon
              return (
                <div key={technique.id} className={`border rounded-lg p-4 transition-all ${technique.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${technique.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <IconComponent className={`h-5 w-5 ${technique.enabled ? 'text-green-600' : 'text-gray-500'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{technique.name}</h4>
                        <Badge variant="outline" className="mt-1">
                          {getCategoryIcon(technique.category)}
                          <span className="ml-1 capitalize">{technique.category}</span>
                        </Badge>
                      </div>
                    </div>
                    <Switch
                      checked={technique.enabled}
                      onCheckedChange={() => toggleTechnique(technique.id)}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                  
                  {technique.enabled && (
                    <div className="space-y-3 pt-3 border-t border-gray-200">
                      <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Configuration</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Technique-specific configuration */}
                        {technique.id === 'cost-anomaly' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-600">Threshold (%)</label>
                              <input
                                type="number"
                                value={technique.config.threshold}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'threshold', parseInt(e.target.value))}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                min="5"
                                max="50"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Sensitivity</label>
                              <select
                                value={technique.config.sensitivity}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'sensitivity', e.target.value)}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </>
                        )}
                        {technique.id === 'trend-forecasting' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-600">Forecast Horizon</label>
                              <select
                                value={technique.config.horizon}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'horizon', e.target.value)}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              >
                                <option value="1month">1 Month</option>
                                <option value="3months">3 Months</option>
                                <option value="6months">6 Months</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Confidence (%)</label>
                              <input
                                type="number"
                                value={technique.config.confidence}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'confidence', parseInt(e.target.value))}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                min="50"
                                max="99"
                              />
                            </div>
                          </>
                        )}
                        {technique.id === 'efficiency-scoring' && (
                          <>
                            <div>
                              <label className="text-xs text-gray-600">Cost Weight (%)</label>
                              <input
                                type="number"
                                value={technique.config.weightCost}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'weightCost', parseInt(e.target.value))}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                min="0"
                                max="100"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-600">Output Weight (%)</label>
                              <input
                                type="number"
                                value={technique.config.weightOutput}
                                onChange={(e) => updateTechniqueConfig(technique.id, 'weightOutput', parseInt(e.target.value))}
                                className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                                min="0"
                                max="100"
                              />
                            </div>
                          </>
                        )}
                        {(technique.id === 'resource-optimization' || technique.id === 'roi-analysis') && (
                          <div className="col-span-2">
                            <label className="text-xs text-gray-600">Update Frequency</label>
                            <select
                              value={technique.config.frequency || 'weekly'}
                              onChange={(e) => updateTechniqueConfig(technique.id, 'frequency', e.target.value)}
                              className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value="daily">Daily</option>
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="tabs-list-green grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="overview" className="tabs-trigger-green flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="cost-analysis" className="tabs-trigger-green flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Cost Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="productivity" className="tabs-trigger-green flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Productivity</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="tabs-trigger-green flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Predictive</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="tabs-trigger-green flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data && (
              <>
                <CostChart 
                  data={data.monthlyTrend}
                  breakdown={data.costBreakdown}
                  detailed={false}
                />
                <ProductivityChart 
                  data={data.productivityTrend}
                  score={87.5}
                  detailed={false}
                />
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Monthly Cost</span>
                  <span className="font-bold">$52,900</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cost per Employee</span>
                  <span className="font-bold">$4,240</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Efficiency Score</span>
                  <span className="font-bold text-green-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cost Trend</span>
                  <div className="flex items-center">
                    <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
                    <span className="font-bold text-green-600">-5.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cloud cost spike</p>
                    <p className="text-xs text-gray-600">+23% this week</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">License underutilization</p>
                    <p className="text-xs text-gray-600">40% unused</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                  <Brain className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New optimization found</p>
                    <p className="text-xs text-gray-600">$3.2K/month savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Configure Techniques
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

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

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Predictive Forecasts</span>
                </CardTitle>
                <CardDescription>AI-powered predictions based on current trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-blue-900">Q2 Cost Forecast</h4>
                      <Badge className="bg-blue-100 text-blue-800">85% Confidence</Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      Total costs projected to increase 15% ($7.9K) due to team expansion and infrastructure scaling.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Current: </span>
                        <span className="font-bold">$52.9K</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Predicted: </span>
                        <span className="font-bold">$60.8K</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-green-900">Productivity Outlook</h4>
                      <Badge className="bg-green-100 text-green-800">92% Confidence</Badge>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Team productivity expected to improve 8% with current optimization initiatives.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-600">Current: </span>
                        <span className="font-bold">87%</span>
                      </div>
                      <div>
                        <span className="text-green-600">Predicted: </span>
                        <span className="font-bold">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Risk Analysis</span>
              </CardTitle>
                <CardDescription>Potential risks and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 border border-red-200 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-red-900">High Risk</h5>
                      <p className="text-sm text-red-700">Cloud cost escalation if scaling continues unchecked</p>
                      <p className="text-xs text-red-600 mt-1">Mitigation: Implement auto-scaling policies</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-yellow-900">Medium Risk</h5>
                      <p className="text-sm text-yellow-700">License overspend due to low utilization</p>
                      <p className="text-xs text-yellow-600 mt-1">Mitigation: Regular license audits</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-semibold text-blue-900">Opportunity</h5>
                      <p className="text-sm text-blue-700">Automation could reduce operational costs by 12%</p>
                      <p className="text-xs text-blue-600 mt-1">Action: Invest in workflow automation tools</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Historical Trend Analysis</CardTitle>
              <CardDescription>Key patterns identified in your data over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                    Cost Trends
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="flex items-center">
                        <ArrowDown className="h-3 w-3 text-green-500 mr-2" />
                        Cloud costs decreased
                      </span>
                      <span className="font-bold text-green-600">-12%</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="flex items-center">
                        <ArrowUp className="h-3 w-3 text-red-500 mr-2" />
                        Software licenses increased
                      </span>
                      <span className="font-bold text-red-600">+8%</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="flex items-center">
                        <Minus className="h-3 w-3 text-blue-500 mr-2" />
                        HR costs stable
                      </span>
                      <span className="font-bold text-blue-600">+2%</span>
                      </li>
                    </ul>
                  </div>
                
                  <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-green-600" />
                    Productivity Trends
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="flex items-center">
                        <ArrowUp className="h-3 w-3 text-green-500 mr-2" />
                        Task completion improved
                      </span>
                      <span className="font-bold text-green-600">+15%</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="flex items-center">
                        <ArrowDown className="h-3 w-3 text-green-500 mr-2" />
                        Cycle time reduced
                      </span>
                      <span className="font-bold text-green-600">-1.2d</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="flex items-center">
                        <ArrowUp className="h-3 w-3 text-yellow-500 mr-2" />
                        Code review time
                      </span>
                      <span className="font-bold text-yellow-600">+0.3d</span>
                      </li>
                    </ul>
                  </div>
                
                  <div className="space-y-4">
                  <h4 className="font-semibold flex items-center">
                    <Target className="h-4 w-4 mr-2 text-orange-600" />
                    Quality Metrics
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="flex items-center">
                        <ArrowDown className="h-3 w-3 text-green-500 mr-2" />
                        Bug rate decreased
                      </span>
                      <span className="font-bold text-green-600">-18%</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span className="flex items-center">
                        <ArrowUp className="h-3 w-3 text-blue-500 mr-2" />
                        Code coverage improved
                      </span>
                      <span className="font-bold text-blue-600">+7%</span>
                      </li>
                    <li className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="flex items-center">
                        <ArrowDown className="h-3 w-3 text-green-500 mr-2" />
                        Resolution time
                      </span>
                      <span className="font-bold text-green-600">-2.1h</span>
                      </li>
                    </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span>AI Model Performance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <div className="text-sm text-gray-600">Prediction Accuracy</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Analyses Run</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cost Predictions</span>
                    <span className="font-semibold">96.1%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '96%'}}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Anomaly Detection</span>
                    <span className="font-semibold">92.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Optimization Impact</span>
                </CardTitle>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">$187.5K</div>
                  <div className="text-sm text-gray-600">Total Savings Identified</div>
                  <div className="text-xs text-gray-500 mt-1">Since implementation</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">This Month</div>
                    <div className="text-green-600">+$24.9K saved</div>
                  </div>
                  <div>
                    <div className="font-semibold">Efficiency Gain</div>
                    <div className="text-blue-600">+12.3%</div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 