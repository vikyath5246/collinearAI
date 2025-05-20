"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, StarOff, Download, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Dataset = {
  hf_id: string
  description: string | null
  size_bytes: number | null
  num_samples: number | null
  download_count: number | null
  impact_score: number | null
}

export default function DatasetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const owner = params.owner as string
  const name = params.name as string

  useEffect(() => {
    const fetchDataset = async () => {
      setIsLoading(true)
      try {
        const data = await apiClient.get<Dataset>(`/datasets/${owner}/${name}`)
        setDataset(data)

        // Check if user is following this dataset
        if (user) {
          try {
            const follows = await apiClient.get<Dataset[]>("/users/me/follows")
            setIsFollowing(follows.some((d) => d.hf_id === data.hf_id))
          } catch (err) {
            console.error("Failed to fetch follow status", err)
          }
        }

        setError(null)
      } catch (err) {
        setError("Failed to load dataset details. Please try again.")
        setDataset(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (owner && name) {
      fetchDataset()
    }
  }, [owner, name, user])

  const handleFollow = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setFollowLoading(true)
    try {
      if (isFollowing) {
        await apiClient.delete(`/datasets/${owner}/${name}/follow`)
        setIsFollowing(false)
      } else {
        await apiClient.post(`/datasets/${owner}/${name}/follow`, {})
        setIsFollowing(true)
      }
    } catch (err) {
      console.error("Failed to update follow status", err)
    } finally {
      setFollowLoading(false)
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
      <Button
        variant="ghost"
        className="mb-6 text-collinear-darkBlue dark:text-white hover:text-collinear-orange dark:hover:text-collinear-orange"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Datasets
      </Button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">{error}</div>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md">
            <div className="p-6">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      ) : dataset ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-collinear-darkBlue dark:text-white">{dataset.hf_id}</h1>
                {dataset.impact_score !== null && (
                  <Badge className={`${getImpactLabel(dataset.impact_score).color} text-white`}>
                    {getImpactLabel(dataset.impact_score).label} Impact
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {dataset.description || "No description available"}
              </p>
            </div>
            <Button
              onClick={handleFollow}
              disabled={followLoading}
              variant={isFollowing ? "outline" : "default"}
              className={
                isFollowing
                  ? "border-gray-300 dark:border-gray-700 text-collinear-darkBlue dark:text-white"
                  : "bg-collinear-orange hover:bg-collinear-orange/90 text-white"
              }
            >
              {followLoading ? (
                "Loading..."
              ) : isFollowing ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4 bg-gray-100 dark:bg-collinear-darkBlue">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-collinear-navy data-[state=active]:text-collinear-darkBlue dark:data-[state=active]:text-white"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="impact"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-collinear-navy data-[state=active]:text-collinear-darkBlue dark:data-[state=active]:text-white"
              >
                Impact Assessment
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-collinear-darkBlue dark:text-white">Dataset Information</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Detailed information about this dataset</p>
                </div>
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Dataset ID</h3>
                        <p className="mt-1 text-collinear-darkBlue dark:text-white">{dataset.hf_id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Size</h3>
                        <p className="mt-1 flex items-center text-collinear-darkBlue dark:text-white">
                          <FileText className="mr-2 h-4 w-4 text-gray-400" />
                          {formatBytes(dataset.size_bytes)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Samples</h3>
                        <p className="mt-1 text-collinear-darkBlue dark:text-white">
                          {dataset.num_samples?.toLocaleString() || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Downloads</h3>
                        <p className="mt-1 flex items-center text-collinear-darkBlue dark:text-white">
                          <Download className="mr-2 h-4 w-4 text-gray-400" />
                          {dataset.download_count?.toLocaleString() || "Unknown"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Hugging Face Link</h3>
                        <p className="mt-1">
                          <a
                            href={`https://huggingface.co/datasets/${dataset.hf_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-collinear-orange hover:underline"
                          >
                            View on Hugging Face
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="impact">
              <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-collinear-darkBlue dark:text-white">Impact Assessment</h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Analysis of the dataset's potential impact</p>
                </div>
                <div className="px-6 pb-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-collinear-darkBlue dark:text-white">Impact Score</h3>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div
                            className={`h-2.5 rounded-full ${
                              dataset.impact_score === null
                                ? "bg-gray-500"
                                : dataset.impact_score < 0.3
                                  ? "bg-green-500"
                                  : dataset.impact_score < 0.7
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                            style={{
                              width: `${dataset.impact_score === null ? 0 : dataset.impact_score * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-collinear-darkBlue dark:text-white">
                          {dataset.impact_score === null ? "Unknown" : `${Math.round(dataset.impact_score * 100)}%`}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-collinear-darkBlue dark:text-white">Assessment Method</h3>
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-collinear-darkBlue rounded-md">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          The impact assessment is calculated using a combination of:
                        </p>
                        <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                          <li>Dataset size and number of samples</li>
                          <li>Download count and popularity</li>
                          <li>Clustering analysis to determine uniqueness and potential influence</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-collinear-darkBlue dark:text-white">Impact Category</h3>
                      <div className="mt-2">
                        <Badge className={`${getImpactLabel(dataset.impact_score).color} text-white text-sm px-3 py-1`}>
                          {getImpactLabel(dataset.impact_score).label} Impact
                        </Badge>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {dataset.impact_score === null
                            ? "Unable to determine impact level due to insufficient data."
                            : dataset.impact_score < 0.3
                              ? "This dataset has a relatively small impact on AI models and applications."
                              : dataset.impact_score < 0.7
                                ? "This dataset has a moderate impact on AI models and may influence certain applications."
                                : "This dataset has a significant impact on AI models and is likely to heavily influence applications."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-collinear-navy rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-collinear-darkBlue dark:text-white">Dataset not found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">The requested dataset could not be found.</p>
          <Button
            className="mt-4 bg-collinear-orange hover:bg-collinear-orange/90 text-white"
            onClick={() => router.push("/datasets")}
          >
            Browse All Datasets
          </Button>
        </div>
      )}
    </div>
  )
}
