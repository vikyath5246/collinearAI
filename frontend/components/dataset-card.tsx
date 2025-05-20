"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink, BarChart2 } from "lucide-react"
import Link from "next/link"
import type { Dataset } from "@/types/dataset"
import { useToast } from "@/components/ui/use-toast"

interface DatasetCardProps {
  dataset: Dataset
  isAuthenticated: boolean
}

export function DatasetCard({ dataset, isAuthenticated }: DatasetCardProps) {
  const [isFollowed, setIsFollowed] = useState(dataset.isFollowed || false)
  const { toast } = useToast()

  const handleFollow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow datasets",
        variant: "destructive",
      })
      return
    }

    setIsFollowed(!isFollowed)
    toast({
      title: isFollowed ? "Unfollowed" : "Followed",
      description: isFollowed ? `You have unfollowed ${dataset.name}` : `You are now following ${dataset.name}`,
    })
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{dataset.name}</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleFollow} className={isFollowed ? "text-orange-500" : ""}>
            <Heart className={`h-5 w-5 ${isFollowed ? "fill-orange-500 text-orange-500" : ""}`} />
            <span className="sr-only">{isFollowed ? "Unfollow" : "Follow"}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-gray-500 mb-4 line-clamp-3">{dataset.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {dataset.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-medium">{dataset.size}</p>
          </div>
          <div>
            <p className="text-gray-500">Downloads</p>
            <p className="font-medium">{dataset.downloads.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Updated</p>
            <p className="font-medium">{dataset.lastUpdated}</p>
          </div>
          <div>
            <p className="text-gray-500">Author</p>
            <p className="font-medium">{dataset.author}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Link href={`/datasets/${dataset.id}`}>
          <Button variant="outline" size="sm">
            <BarChart2 className="h-4 w-4 mr-2" />
            Impact Assessment
          </Button>
        </Link>
        <Link href={`/datasets/${dataset.id}`}>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            <ExternalLink className="h-4 w-4 mr-2" />
            Explore
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
