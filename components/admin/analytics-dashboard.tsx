"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Users,
  CreditCard,
  Heart,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"

interface AnalyticsData {
  users: {
    total: number
    new: number
    active: number
    verified: number
  }
  subscriptions: {
    active: number
    new: number
    byTier: Record<string, number>
  }
  matches: {
    total: number
    new: number
    accepted: number
  }
  messages: {
    total: number
    new: number
    avgPerConversation: number
  }
  revenue: {
    mrr: number
    newMRR: number
    churnRate: number
  }
  churn: {
    count: number
    rate: number
  }
  engagement: {
    dau: number
    messagesPerUser: number
    likesCount: number
  }
}

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
}

const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#00f2fe", "#43e97b"]

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?period=${period}`)
      if (!response.ok) throw new Error("Failed to fetch analytics")
      const result = await response.json()
      setData(result.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const statCards: StatCard[] = [
    {
      title: "Total Users",
      value: data.users.total.toLocaleString(),
      change: data.users.new,
      icon: <Users className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Active Subscriptions",
      value: data.subscriptions.active.toLocaleString(),
      change: data.subscriptions.new,
      icon: <CreditCard className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Matches Created",
      value: data.matches.total.toLocaleString(),
      change: data.matches.new,
      icon: <Heart className="h-4 w-4" />,
      trend: "up",
    },
    {
      title: "Messages Sent",
      value: data.messages.total.toLocaleString(),
      change: data.messages.new,
      icon: <MessageSquare className="h-4 w-4" />,
      trend: "up",
    },
  ]

  const subscriptionData = [
    { name: "Premium", value: data.subscriptions.byTier.premium || 0 },
    { name: "VIP", value: data.subscriptions.byTier.vip || 0 },
    { name: "Model Pro", value: data.subscriptions.byTier.model_pro || 0 },
    { name: "Family", value: data.subscriptions.byTier.family || 0 },
    { name: "Corporate", value: data.subscriptions.byTier.corporate || 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Key metrics and performance indicators
          </p>
        </div>
        <div className="flex gap-2">
          {["7", "30", "90", "365"].map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              onClick={() => setPeriod(p)}
            >
              {p === "7"
                ? "7D"
                : p === "30"
                  ? "30D"
                  : p === "90"
                    ? "90D"
                    : "1Y"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className="text-muted-foreground">{stat.icon}</div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <Badge
                  variant="outline"
                  className={
                    stat.trend === "up"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : stat.trend === "down"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : ""
                  }
                >
                  {stat.trend === "up" ? "+" : stat.trend === "down" ? "-" : ""}{" "}
                  {stat.change} this period
                </Badge>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue & Churn */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Metrics
            </CardTitle>
            <CardDescription>Monthly recurring revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current MRR</p>
              <p className="text-3xl font-bold">
                ${data.revenue.mrr.toFixed(0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New MRR</p>
              <p className="text-2xl font-semibold">
                ${data.revenue.newMRR.toFixed(0).toLocaleString()}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Churn Rate</p>
              <p className="text-lg font-semibold text-red-600">
                {data.revenue.churnRate.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Engagement Metrics
            </CardTitle>
            <CardDescription>User activity and interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Daily Active Users</p>
              <p className="text-3xl font-bold">
                {data.engagement.dau.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Messages Per User</p>
              <p className="text-2xl font-semibold">
                {data.engagement.messagesPerUser.toFixed(1)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Total Likes</p>
              <p className="text-lg font-semibold">
                {data.engagement.likesCount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Distribution by Tier</CardTitle>
          <CardDescription>Active subscribers by plan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>User progression through platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: "Total Users",
                count: data.users.total,
                percentage: 100,
              },
              {
                name: "Active Users",
                count: data.users.active,
                percentage: (data.users.active / data.users.total) * 100,
              },
              {
                name: "Paid Subscribers",
                count: data.subscriptions.active,
                percentage:
                  (data.subscriptions.active / data.users.total) * 100,
              },
              {
                name: "Active Matches",
                count: data.matches.accepted,
                percentage:
                  (data.matches.accepted / data.subscriptions.active) * 100,
              },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.count.toLocaleString()} ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
