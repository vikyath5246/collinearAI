"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import {
  CuboidIcon,
  Music,
  Map,
  ImageIcon,
  Table2,
  FileText,
  LineChart,
  Video,
  Search,
  X,
  SlidersHorizontal,
  Eye,
  Download,
  Clock,
  Heart,
  HeartOff,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { fetchDatasets } from "@/lib/api"
import type { Dataset } from "@/types/dataset"
import Link from "next/link"

// Extended dataset type with additional properties
interface ExtendedDataset extends Dataset {
  modalities: string[]
  format: string
  sizeKB: number
}

// Modality options with icons
const modalities = [
  { id: "3d", label: "3D", icon: <CuboidIcon className="h-4 w-4 mr-2" /> },
  { id: "audio", label: "Audio", icon: <Music className="h-4 w-4 mr-2" /> },
  { id: "geospatial", label: "Geospatial", icon: <Map className="h-4 w-4 mr-2" /> },
  { id: "image", label: "Image", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
  { id: "tabular", label: "Tabular", icon: <Table2 className="h-4 w-4 mr-2" /> },
  { id: "text", label: "Text", icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: "time-series", label: "Time-series", icon: <LineChart className="h-4 w-4 mr-2" /> },
  { id: "video", label: "Video", icon: <Video className="h-4 w-4 mr-2" /> },
]

// Format options
const formats = [
  { id: "json", label: "json" },
  { id: "csv", label: "csv" },
  { id: "parquet", label: "parquet" },
  { id: "imageFolder", label: "imageFolder" },
  { id: "soundFolder", label: "soundFolder" },
  { id: "webdataset", label: "webdataset" },
  { id: "text", label: "text" },
  { id: "arrow", label: "arrow" },
]

// Sort options
const sortOptions = [
  { id: "trending", label: "Trending" },
  { id: "downloads", label: "Most Downloads" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "name", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
]

// Size formatter
function formatSize(sizeInKB: number): string {
  if (sizeInKB < 1000) {
    return `${sizeInKB.toFixed(0)} KB`
  } else if (sizeInKB < 1000000) {
    return `${(sizeInKB / 1000).toFixed(1)} MB`
  } else if (sizeInKB < 1000000000) {
    return `${(sizeInKB / 1000000).toFixed(1)} GB`
  } else {
    return `${(sizeInKB / 1000000000).toFixed(1)} TB`
  }
}

// Format number with K, M abbreviations
function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`
  } else {
    return `${(num / 1000000).toFixed(1)}M`
  }
}

// Convert size string to KB
function sizeToKB(sizeStr: string): number {
  const value = Number.parseFloat(sizeStr.split(" ")[0])
  const unit = sizeStr.split(" ")[1]

  switch (unit) {
    case "KB":
      return value
    case "MB":
      return value * 1000
    case "GB":
      return value * 1000000
    case "TB":
      return value * 1000000000
    default:
      return value
  }
}

// Map tags to modalities
function tagsToModalities(tags: string[]): string[] {
  const modalityMap: Record<string, string> = {
    image: "image",
    "computer-vision": "image",
    vision: "image",
    text: "text",
    nlp: "text",
    audio: "audio",
    speech: "audio",
    asr: "audio",
    video: "video",
    "action-recognition": "video",
    tabular: "tabular",
    "time-series": "time-series",
    geospatial: "geospatial",
    transportation: "geospatial",
    "3d": "3d",
    "shape-analysis": "3d",
  }

  const result = new Set<string>()

  tags.forEach((tag) => {
    if (modalityMap[tag]) {
      result.add(modalityMap[tag])
    }
  })

  return Array.from(result)
}

// Determine format based on tags and name
function determineFormat(dataset: Dataset): string {
  const name = dataset.name.toLowerCase()
  const tags = dataset.tags.map((t) => t.toLowerCase())

  if (tags.includes("image") || name.includes("image")) {
    return "imageFolder"
  } else if (tags.includes("audio") || name.includes("audio") || tags.includes("speech")) {
    return "soundFolder"
  } else if (tags.includes("tabular") || name.includes("csv")) {
    return "csv"
  } else if (tags.includes("text") || tags.includes("nlp")) {
    return "text"
  } else {
    // Default formats based on dataset size
    const size = sizeToKB(dataset.size)
    if (size > 1000000) {
      // > 1GB
      return "parquet"
    } else if (size > 10000) {
      // > 10MB
      return "arrow"
    } else {
      return "json"
    }
  }
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<ExtendedDataset[]>([])
  const [filteredDatasets, setFilteredDatasets] = useState<ExtendedDataset[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [sizeRange, setSizeRange] = useState([0, 100]) // Percentage of max size
  const [sortBy, setSortBy] = useState("trending")
  const [totalCount, setTotalCount] = useState(0)
  const [maxSize, setMaxSize] = useState(1000000000) // 1GB default
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const { user } = useAuth()

  // Load datasets
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setLoading(true)
        const data = await fetchDatasets()

        // Enhance datasets with additional properties
        const enhancedData = data.map((dataset) => ({
          ...dataset,
          modalities: tagsToModalities(dataset.tags),
          format: determineFormat(dataset),
          sizeKB: sizeToKB(dataset.size),
        }))

        // Find max size for slider
        const maxDatasetSize = Math.max(...enhancedData.map((d) => d.sizeKB))
        setMaxSize(maxDatasetSize)

        setDatasets(enhancedData)
        setFilteredDatasets(enhancedData)
        setTotalCount(enhancedData.length)
      } catch (error) {
        console.error("Failed to fetch datasets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDatasets()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...datasets]
    let filterCount = 0

    // Filter by tab
    if (activeTab === "followed" && user) {
      filtered = filtered.filter((dataset) => dataset.isFollowed)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (dataset) =>
          dataset.name.toLowerCase().includes(query) ||
          dataset.description.toLowerCase().includes(query) ||
          dataset.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      filterCount++
    }

    // Filter by modalities
    if (selectedModalities.length > 0) {
      filtered = filtered.filter((dataset) => selectedModalities.some((m) => dataset.modalities.includes(m)))
      filterCount++
    }

    // Filter by formats
    if (selectedFormats.length > 0) {
      filtered = filtered.filter((dataset) => selectedFormats.includes(dataset.format))
      filterCount++
    }

    // Filter by size
    const minSize = (sizeRange[0] / 100) * maxSize
    const maxSizeValue = (sizeRange[1] / 100) * maxSize

    if (sizeRange[0] > 0 || sizeRange[1] < 100) {
      filtered = filtered.filter((dataset) => dataset.sizeKB >= minSize && dataset.sizeKB <= maxSizeValue)
      filterCount++
    }

    // Sort datasets
    switch (sortBy) {
      case "downloads":
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "trending":
      default:
        // Sort by a combination of downloads and recency
        filtered.sort((a, b) => {
          const aScore = a.downloads * (1 + 1 / (new Date().getTime() - new Date(a.lastUpdated).getTime()))
          const bScore = b.downloads * (1 + 1 / (new Date().getTime() - new Date(b.lastUpdated).getTime()))
          return bScore - aScore
        })
    }

    setFilteredDatasets(filtered)
    setActiveFiltersCount(filterCount)
  }, [datasets, searchQuery, selectedModalities, selectedFormats, sizeRange, sortBy, activeTab, user, maxSize])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedModalities([])
    setSelectedFormats([])
    setSizeRange([0, 100])
    setSortBy("trending")
  }

  const toggleModality = (modalityId: string) => {
    setSelectedModalities((prev) =>
      prev.includes(modalityId) ? prev.filter((id) => id !== modalityId) : [...prev, modalityId],
    )
  }

  const toggleFormat = (formatId: string) => {
    setSelectedFormats((prev) => (prev.includes(formatId) ? prev.filter((id) => id !== formatId) : [...prev, formatId]))
  }

  // Filter panel component
  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Modalities */}
      <div>
        <h4 className="text-sm font-medium mb-3">Modalities</h4>
        <div className="grid grid-cols-2 gap-2">
          {modalities.map((modality) => (
            <div key={modality.id} className="flex items-center space-x-2">
              <Checkbox
                id={`modality-${modality.id}`}
                checked={selectedModalities.includes(modality.id)}
                onCheckedChange={() => toggleModality(modality.id)}
              />
              <label htmlFor={`modality-${modality.id}`} className="text-sm flex items-center cursor-pointer">
                {modality.icon}
                {modality.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Size Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Size</h4>
          <div className="text-xs text-gray-500">
            {formatSize((sizeRange[0] / 100) * maxSize)} - {formatSize((sizeRange[1] / 100) * maxSize)}
          </div>
        </div>
        <Slider
          defaultValue={sizeRange}
          max={100}
          step={1}
          value={sizeRange}
          onValueChange={setSizeRange}
          className="mb-6"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>1KB</span>
          <span>1MB</span>
          <span>1GB</span>
          <span>1TB</span>
        </div>
      </div>

      {/* Format */}
      <div>
        <h4 className="text-sm font-medium mb-3">Format</h4>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((format) => (
            <div key={format.id} className="flex items-center space-x-2">
              <Checkbox
                id={`format-${format.id}`}
                checked={selectedFormats.includes(format.id)}
                onCheckedChange={() => toggleFormat(format.id)}
              />
              <label htmlFor={`format-${format.id}`} className="text-sm cursor-pointer">
                {format.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Datasets</h1>
            <p className="text-gray-500 mt-1">{totalCount.toLocaleString()} datasets available</p>
          </div>

          {/* Mobile filter button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <FilterPanel />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters - desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <FilterPanel />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search datasets..."
                  className="pl-9 pr-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="w-full sm:w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Datasets</TabsTrigger>
                <TabsTrigger value="followed" disabled={!user}>
                  My Followed Datasets
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <span className="ml-2">Loading datasets...</span>
                  </div>
                ) : filteredDatasets.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDatasets.map((dataset) => (
                      <DatasetItem key={dataset.id} dataset={dataset} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No datasets found</h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <Button onClick={clearFilters} className="bg-orange-500 hover:bg-orange-600">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followed">
                {!user ? (
                  <div className="text-center py-12 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Sign in to view followed datasets</h3>
                    <p className="text-gray-500 mb-6">
                      You need to be signed in to follow and view your followed datasets.
                    </p>
                    <Button asChild className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/sign-in">Sign In</Link>
                    </Button>
                  </div>
                ) : loading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    <span className="ml-2">Loading datasets...</span>
                  </div>
                ) : filteredDatasets.length > 0 ? (
                  <div className="space-y-4">
                    {filteredDatasets.map((dataset) => (
                      <DatasetItem key={dataset.id} dataset={dataset} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">No followed datasets</h3>
                    <p className="text-gray-500 mb-6">You haven't followed any datasets yet.</p>
                    <Button asChild className="bg-orange-500 hover:bg-orange-600">
                      <Link href="/datasets?tab=all">Browse Datasets</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Dataset item component
function DatasetItem({ dataset }: { dataset: ExtendedDataset }) {
  const { user } = useAuth()
  const [isFollowed, setIsFollowed] = useState(dataset.isFollowed || false)

  const handleFollow = () => {
    if (!user) return
    setIsFollowed(!isFollowed)
  }

  // Get icon for primary modality
  const getPrimaryModalityIcon = () => {
    if (dataset.modalities.length === 0) return <FileText className="h-4 w-4" />

    const primaryModality = dataset.modalities[0]
    const modalityObj = modalities.find((m) => m.id === primaryModality)

    return modalityObj?.icon || <FileText className="h-4 w-4" />
  }

  return (
    <div className="border rounded-lg p-4 hover:border-orange-200 transition-colors">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-10 w-10 rounded-full bg-orange-100 items-center justify-center">
          {getPrimaryModalityIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/datasets/${dataset.id}`} className="text-lg font-medium hover:text-orange-500">
                {dataset.name}
              </Link>
              <p className="text-sm text-gray-500 mb-2">{dataset.author}</p>
            </div>

            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleFollow}
                title={isFollowed ? "Unfollow" : "Follow"}
              >
                {isFollowed ? (
                  <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
                ) : (
                  <HeartOff className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{dataset.description}</p>

          <div className="flex flex-wrap gap-2 mb-3">
            {dataset.modalities.map((modality) => {
              const modalityObj = modalities.find((m) => m.id === modality)
              return (
                <Badge key={modality} variant="secondary" className="flex items-center">
                  {modalityObj?.icon}
                  {modalityObj?.label}
                </Badge>
              )
            })}
            <Badge variant="outline">{dataset.format}</Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span>Viewer</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>Updated {dataset.lastUpdated}</span>
            </div>
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              <span>{formatNumber(dataset.downloads)}</span>
            </div>
            <div>
              <span>{dataset.size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
