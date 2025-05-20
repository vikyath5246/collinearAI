"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DatasetCard } from "@/components/dataset-card"
import { fetchDatasets } from "@/lib/api"
import type { Dataset } from "@/types/dataset"
// Update the import path for useAuth
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Settings, History, BarChart2 } from "lucide-react"

export default function DashboardPage() {
  const [followedDatasets, setFollowedDatasets] = useState<Dataset[]>([])
  const [recentDatasets, setRecentDatasets] = useState<Dataset[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !loading) {
      router.push("/sign-in")
    }
  }, [user, router, loading])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const datasets = await fetchDatasets()

        // Filter followed datasets
        const followed = datasets.filter((dataset) => dataset.isFollowed)
        setFollowedDatasets(followed)

        // Get recent datasets (mock data - in a real app this would be from user history)
        setRecentDatasets(datasets.slice(0, 3))
      } catch (error) {
        console.error("Failed to fetch datasets:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadData()
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
            <p className="text-lg">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Dataset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Followed Datasets</CardTitle>
              <CardDescription>Datasets you're currently following</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{followedDatasets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Your recent dataset interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{recentDatasets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Impact Assessments</CardTitle>
              <CardDescription>Completed impact assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">2</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="followed" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="followed">Followed Datasets</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="assessments">Impact Assessments</TabsTrigger>
          </TabsList>
          <TabsContent value="followed" className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading datasets...</span>
              </div>
            ) : followedDatasets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {followedDatasets.map((dataset) => (
                  <DatasetCard key={dataset.id} dataset={dataset} isAuthenticated={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No followed datasets</h3>
                <p className="text-gray-500 mb-6">You haven't followed any datasets yet.</p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <a href="/datasets">Browse Datasets</a>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent" className="pt-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                <span className="ml-2">Loading recent activity...</span>
              </div>
            ) : recentDatasets.length > 0 ? (
              <div className="space-y-4">
                {recentDatasets.map((dataset) => (
                  <Card key={dataset.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <History className="h-8 w-8 text-gray-400" />
                        <div className="flex-1">
                          <p className="font-medium">{dataset.name}</p>
                          <p className="text-sm text-gray-500">Viewed dataset details</p>
                        </div>
                        <p className="text-sm text-gray-500">Today</p>
                        <Button variant="ghost" size="sm" asChild className="ml-auto">
                          <a href={`/datasets/${dataset.id}`}>View</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
                <p className="text-gray-500 mb-6">You haven't interacted with any datasets recently.</p>
                <Button asChild className="bg-orange-500 hover:bg-orange-600">
                  <a href="/datasets">Browse Datasets</a>
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="assessments" className="pt-6">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <BarChart2 className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">MNIST + CIFAR-10 Combination</p>
                      <p className="text-sm text-gray-500">
                        Impact Level: <span className="text-yellow-500 font-medium">Medium</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <a href="#">View Report</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <BarChart2 className="h-6 w-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">IMDB Reviews + CoLA Combination</p>
                      <p className="text-sm text-gray-500">
                        Impact Level: <span className="text-red-500 font-medium">High</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="ml-auto">
                      <a href="#">View Report</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
