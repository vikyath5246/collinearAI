"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { StarOff, Star, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Dataset = {
  hf_id: string
  description: string | null
  size_bytes: number | null
  num_samples: number | null
  download_count: number | null
  impact_score: number | null
}

export default function FollowsPage() {
  const [follows, setFollows] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !isLoading) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    const fetchFollows = async () => {
      setIsLoading(true)
      try {
        const data = await apiClient.get<Dataset[]>("/users/me/follows")
        setFollows(data)
        setError(null)
      } catch (err) {
        setError("Failed to load followed datasets. Please try again.")
        setFollows([])
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchFollows()
    }
  }, [user])

  const handleUnfollow = async (dataset: Dataset) => {
    const [owner, name] = dataset.hf_id.split("/")
    try {
      await apiClient.delete(`/datasets/${owner}/${name}/follow`)
      setFollows(follows.filter((d) => d.hf_id !== dataset.hf_id))
    } catch (err) {
      setError("Failed to unfollow dataset. Please try again.")
    }
  }

  const formatBytes = (bytes: number | null) => {
    if (bytes === null) return "Unknown"
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
    if (bytes === 0) return "0 Byte"
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i]
  }

  const getImpactLabel = (score: number | null) => {
    if (score === null) return { label: "Unknown", color: "bg-gray-500" }
    if (score < 0.3) return { label: "Low", color: "bg-green-500" }
    if (score < 0.7) return { label: "Medium", color: "bg-yellow-500" }
    return { label: "High", color: "bg-red-500" }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-collinear-darkBlue dark:text-white">My Followed Datasets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage the datasets you are following</p>
        </div>
        <Button
          onClick={() => router.push("/datasets")}
          className="bg-collinear-orange hover:bg-collinear-orange/90 text-white"
        >
          <Star className="mr-2 h-4 w-4" />
          Follow More Datasets
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-collinear-navy rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="px-5 pb-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="px-5 pb-5">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : follows.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-collinear-navy rounded-lg shadow-md">
          <Star className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-collinear-darkBlue dark:text-white">No followed datasets</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300">You are not following any datasets yet.</p>
          <Button
            className="mt-4 bg-collinear-orange hover:bg-collinear-orange/90 text-white"
            onClick={() => router.push("/datasets")}
          >
            Browse Datasets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {follows.map((dataset) => {
            const [owner, name] = dataset.hf_id.split("/")
            const impact = getImpactLabel(dataset.impact_score)

            return (
              <div
                key={dataset.hf_id}
                className="bg-white dark:bg-collinear-navy rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold truncate text-collinear-darkBlue dark:text-white">
                      {dataset.hf_id}
                    </h2>
                    <Badge className={`${impact.color} text-white`}>{impact.label} Impact</Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                    {dataset.description || "No description available"}
                  </p>
                </div>
                <div className="px-5 pb-3 flex-grow">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Size:</span>{" "}
                      <span className="text-collinear-darkBlue dark:text-white">{formatBytes(dataset.size_bytes)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Samples:</span>{" "}
                      <span className="text-collinear-darkBlue dark:text-white">
                        {dataset.num_samples?.toLocaleString() || "Unknown"}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 dark:text-gray-400">Downloads:</span>{" "}
                      <span className="text-collinear-darkBlue dark:text-white">
                        {dataset.download_count?.toLocaleString() || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-5 flex justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/datasets/${owner}/${name}`)}
                    className="text-collinear-darkBlue dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-collinear-darkBlue"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnfollow(dataset)}
                    className="text-collinear-darkBlue dark:text-white hover:text-collinear-orange dark:hover:text-collinear-orange"
                  >
                    <StarOff className="h-4 w-4 mr-1" />
                    Unfollow
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
