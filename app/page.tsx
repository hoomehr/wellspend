import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Shield, Database, Zap, TrendingUp, Users } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/dashboard")
  }

  const features = [
    {
      icon: Shield,
      title: "Privacy-First",
      description: "All data stays within your infrastructure. No external API calls without your approval."
    },
    {
      icon: BarChart3,
      title: "Cost Optimization",
      description: "Track and analyze spending across cloud, HR, and operational expenses."
    },
    {
      icon: TrendingUp,
      title: "Productivity Insights",
      description: "Monitor team efficiency and task completion rates with actionable metrics."
    },
    {
      icon: Database,
      title: "Easy Data Import",
      description: "Upload CSV/JSON files or connect to Jira, Notion, AWS billing APIs."
    },
    {
      icon: Zap,
      title: "Smart Recommendations",
      description: "Get AI-powered suggestions for cost savings and productivity improvements."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure access control with Admin, Finance, and Operations roles."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Wellspend</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Privacy-First Cost & Efficiency
            <span className="block text-blue-600">Optimization Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Self-hosted platform that keeps your financial, HR, and productivity data secure 
            while providing powerful insights for cost optimization and efficiency improvements.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">100% Private</h3>
              <p className="text-gray-600">
                All data processing happens in your infrastructure. No cloud dependencies.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Proven Savings</h3>
              <p className="text-gray-600">
                Average customers save 15-25% on operational costs within 3 months.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Quick Setup</h3>
              <p className="text-gray-600">
                Deploy with Docker in minutes. Start analyzing your data immediately.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for cost optimization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Icon className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Demo Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            See Wellspend in Action
          </h2>
          <div className="bg-gray-100 rounded-lg p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Interactive Dashboard Demo
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore cost trends, productivity metrics, and optimization recommendations
                </p>
                <Link href="/signin">
                  <Button size="lg">
                    Try the Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your costs?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join organizations that trust Wellspend to keep their data private while 
            maximizing efficiency and reducing costs.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started Free
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-blue-600">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold">Wellspend</span>
              </div>
              <p className="text-gray-600">
                Privacy-first cost optimization platform for modern teams.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="#features" className="hover:text-blue-600">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-blue-600">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/docs" className="hover:text-blue-600">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link href="/security" className="hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 Wellspend. Built with privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 