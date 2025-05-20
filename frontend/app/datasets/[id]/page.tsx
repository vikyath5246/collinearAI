"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Loader2, Heart, Download, Share2, BarChart2, AlertTriangle } from "lucide-react"
import { fetchDatasetById, getDatasetImpact, type ImpactAssessment } from "@/lib/api"
import type { Dataset } from "@/types/dataset"
import { useToast } from "@/components/ui/use-toast"
// Update the import path for useAuth
import { useAuth } from "@/components/auth-provider"
import { ImpactVisualization } from "@/components/impact-visualization"

export default function DatasetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [dataset, setDataset] = useState<Dataset | null>(null)
  const [impact, setImpact] = useState<ImpactAssessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFollowed, setIsFollowed] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const datasetData = await fetchDatasetById(params.id)
        if (datasetData) {
          setDataset(datasetData)
          setIsFollowed(datasetData.isFollowed || false)

          // Only fetch impact assessment if dataset exists
          const impactData = await getDatasetImpact(params.id)
          setImpact(impactData)
        }
      } catch (error) {
        console.error("Failed to fetch dataset:", error)
        toast({
          title: "Error",
          description: "Failed to load dataset information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id, toast])

  const handleFollow = () => {
    if (!user) {
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
      description: isFollowed ? `You have unfollowed ${dataset?.name}` : `You are now following ${dataset?.name}`,
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: `Downloading ${dataset?.name}...`,
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Dataset link copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
            <p className="text-lg">Loading dataset information...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!dataset) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Dataset Not Found</h1>
            <p className="text-gray-500 mb-6">The dataset you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <a href="/datasets">Browse Datasets</a>
            </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold">{dataset.name}</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFollow}
                  className={isFollowed ? "text-orange-500" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFollowed ? "fill-orange-500 text-orange-500" : ""}`} />
                  {isFollowed ? "Following" : "Follow"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Dataset Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{dataset.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-medium">{dataset.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Downloads</p>
                    <p className="font-medium">{dataset.downloads.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{dataset.lastUpdated}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Author</p>
                    <p className="font-medium">{dataset.author}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dataset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="impact" className="mb-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="impact">Impact Assessment</TabsTrigger>
                <TabsTrigger value="usage">Usage Examples</TabsTrigger>
                <TabsTrigger value="history">Version History</TabsTrigger>
              </TabsList>
              <TabsContent value="impact" className="pt-4">
                {impact ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart2 className="h-5 w-5 mr-2 text-orange-500" />
                          Impact Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-6">
                          <div>
                            <h3 className="text-lg font-medium mb-1">Overall Impact</h3>
                            <Badge
                              className={
                                impact.level === "high"
                                  ? "bg-red-500"
                                  : impact.level === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }
                            >
                              {impact.level.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Score</p>
                            <p className="text-3xl font-bold">{impact.score}</p>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium mb-4">Impact Factors</h3>
                        <div className="space-y-4 mb-6">
                          {impact.factors.map((factor, index) => (
                            <div key={index}>
                              <div className="flex justify-between mb-1">
                                <p className="text-sm font-medium">{factor.name}</p>
                                <p className="text-sm">{factor.value}%</p>
                              </div>
                              <Progress value={factor.value} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                            </div>
                          ))}
                        </div>

                        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {impact.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-700">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-500 mr-2" />
                    <span>Loading impact assessment...</span>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="usage" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md bg-gray-50 p-4">
                        <h3 className="text-lg font-medium mb-2">Python with Hugging Face Datasets</h3>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                          <code>{`from datasets import load_dataset

# Load the dataset
dataset = load_dataset("${dataset.name.toLowerCase().replace(/\s+/g, "_")}")

# Print dataset info
print(dataset)

# Access the training split
train_data = dataset["train"]

# Example of processing the first few examples
for example in train_data[:5]:
    print(example)
`}</code>
                        </pre>
                      </div>

                      <div className="rounded-md bg-gray-50 p-4">
                        <h3 className="text-lg font-medium mb-2">Using with PyTorch</h3>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto">
                          <code>{`import torch
from datasets import load_dataset
from transformers import AutoTokenizer, DataCollatorWithPadding
from torch.utils.data import DataLoader

# Load dataset
dataset = load_dataset("${dataset.name.toLowerCase().replace(/\s+/g, "_")}")

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# Tokenize function
def tokenize_function(examples):
    return tokenizer(examples["text"], padding="max_length", truncation=True)

# Apply tokenization
tokenized_datasets = dataset.map(tokenize_function, batched=True)

# Prepare for PyTorch
tokenized_datasets = tokenized_datasets.remove_columns(["text"])
tokenized_datasets = tokenized_datasets.rename_column("label", "labels")
tokenized_datasets.set_format("torch")

# Create data loader
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)
train_dataloader = DataLoader(
    tokenized_datasets["train"], 
    batch_size=8, 
    shuffle=True, 
    collate_fn=data_collator
)
`}</code>
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Version History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border-l-2 border-orange-500 pl-4 pb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Version 2.1.0</h3>
                            <p className="text-sm text-gray-500">{dataset.lastUpdated}</p>
                          </div>
                          <Badge>Latest</Badge>
                        </div>
                        <p className="mt-2">Updated dataset with additional examples and fixed annotation errors.</p>
                      </div>

                      <div className="border-l-2 border-gray-200 pl-4 pb-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Version 2.0.0</h3>
                            <p className="text-sm text-gray-500">2023-06-15</p>
                          </div>
                        </div>
                        <p className="mt-2">Major update with expanded dataset size and improved data quality.</p>
                      </div>

                      <div className="border-l-2 border-gray-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Version 1.0.0</h3>
                            <p className="text-sm text-gray-500">2022-11-30</p>
                          </div>
                        </div>
                        <p className="mt-2">Initial release of the dataset.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>Impact Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  {impact ? (
                    <ImpactVisualization impact={impact} />
                  ) : (
                    <div className="flex items-center justify-center h-64">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Related Datasets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataset.tags.length > 0 && (
                      <>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">WikiText-103</p>
                            <p className="text-sm text-gray-500">Text, Language Modeling</p>
                          </div>
                          <Badge variant="outline">83% similar</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">GLUE Benchmark</p>
                            <p className="text-sm text-gray-500">Text, Benchmark</p>
                          </div>
                          <Badge variant="outline">76% similar</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">MultiNLI</p>
                            <p className="text-sm text-gray-500">Text, NLI</p>
                          </div>
                          <Badge variant="outline">71% similar</Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
