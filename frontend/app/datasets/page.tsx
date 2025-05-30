"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/context/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Database, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Dataset = {
  hf_id: string
  description: string | null
  size_bytes: number | null
  num_samples: number | null
  download_count: number | null
  impact_score: number | null
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchDatasets = async () => {
      setIsLoading(true)
      try {
        const url = searchQuery ? `/datasets?search=${encodeURIComponent(searchQuery)}` : "/datasets"
        const data = await apiClient.get<Dataset[]>(url)
        setDatasets(data)
        setError(null)
      } catch (err) {
        setError("Failed to load datasets. Please try again.")
        setDatasets([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDatasets()
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already triggered by the useEffect when searchQuery changes
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
          <h1 className="text-3xl font-bold text-collinear-darkBlue dark:text-white">Datasets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Explore public datasets available on Hugging Face</p>
        </div>
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search datasets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[300px] border-gray-300 focus:border-collinear-orange focus:ring-collinear-orange"
            />
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded-md mb-6">{error}</div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : datasets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-collinear-navy rounded-lg shadow-md">
          <Database className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-collinear-darkBlue dark:text-white">No datasets found</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300">
            {searchQuery
              ? `No results for "${searchQuery}". Try a different search term.`
              : "There are no datasets available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => {
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
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // This would be replaced with actual follow/unfollow logic
                        alert(`Follow functionality would be implemented here for ${dataset.hf_id}`)
                      }}
                      className="text-collinear-darkBlue dark:text-white hover:text-collinear-orange dark:hover:text-collinear-orange"
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Follow
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
