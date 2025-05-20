"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"

interface DatasetFilterProps {
  tags: string[]
  onTagSelect: (tags: string[]) => void
}

export function DatasetFilter({ tags, onTagSelect }: DatasetFilterProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagSearch, setTagSearch] = useState("")

  const filteredTags = tags.filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      const newTags = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]

      onTagSelect(newTags)
      return newTags
    })
  }

  const clearFilters = () => {
    setSelectedTags([])
    onTagSelect([])
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Filters</CardTitle>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-sm">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="relative mb-3">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="pl-8 text-sm"
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="text-sm cursor-pointer">
                      {tag}
                    </Label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags found</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
