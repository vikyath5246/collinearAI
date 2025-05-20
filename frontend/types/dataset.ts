export interface Dataset {
  id: string
  name: string
  description: string
  size: string
  downloads: number
  lastUpdated: string
  author: string
  tags: string[]
  isFollowed?: boolean
}
