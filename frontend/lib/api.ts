import type { Dataset } from "@/types/dataset"

// Mock data for datasets with more variety
const mockDatasets: Dataset[] = [
  {
    id: "1",
    name: "IMDB Reviews",
    description:
      "A large dataset of movie reviews for sentiment analysis tasks. Contains 50,000 highly polarized reviews for binary classification.",
    size: "80 MB",
    downloads: 1250000,
    lastUpdated: "2023-12-15",
    author: "Stanford NLP",
    tags: ["text", "sentiment-analysis", "classification", "english", "nlp"],
    isFollowed: false,
  },
  {
    id: "2",
    name: "MNIST",
    description:
      "The MNIST database of handwritten digits has a training set of 60,000 examples, and a test set of 10,000 examples.",
    size: "11 MB",
    downloads: 3500000,
    lastUpdated: "2023-10-05",
    author: "Yann LeCun",
    tags: ["image", "classification", "computer-vision", "vision"],
    isFollowed: true,
  },
  {
    id: "3",
    name: "CoLA",
    description:
      "The Corpus of Linguistic Acceptability consists of English acceptability judgments drawn from books and journal articles on linguistic theory.",
    size: "614 KB",
    downloads: 450000,
    lastUpdated: "2023-11-20",
    author: "NYU",
    tags: ["text", "linguistics", "english", "classification", "nlp"],
    isFollowed: false,
  },
  {
    id: "4",
    name: "COCO",
    description:
      "COCO is a large-scale object detection, segmentation, and captioning dataset with over 200,000 labeled images.",
    size: "25 GB",
    downloads: 980000,
    lastUpdated: "2023-09-12",
    author: "Microsoft",
    tags: ["image", "object-detection", "segmentation", "computer-vision", "vision"],
    isFollowed: false,
  },
  {
    id: "5",
    name: "SQuAD",
    description:
      "Stanford Question Answering Dataset is a reading comprehension dataset consisting of questions posed on a set of Wikipedia articles.",
    size: "35 MB",
    downloads: 870000,
    lastUpdated: "2023-08-30",
    author: "Stanford NLP",
    tags: ["text", "question-answering", "reading-comprehension", "english", "nlp"],
    isFollowed: false,
  },
  {
    id: "6",
    name: "WikiText-103",
    description:
      "A collection of over 100 million tokens extracted from verified Good and Featured articles on Wikipedia.",
    size: "183 MB",
    downloads: 520000,
    lastUpdated: "2023-07-18",
    author: "Salesforce Research",
    tags: ["text", "language-modeling", "english", "nlp"],
    isFollowed: false,
  },
  {
    id: "7",
    name: "GLUE Benchmark",
    description:
      "The General Language Understanding Evaluation benchmark is a collection of resources for training, evaluating, and analyzing natural language understanding systems.",
    size: "358 MB",
    downloads: 690000,
    lastUpdated: "2023-11-05",
    author: "NYU & UW",
    tags: ["text", "benchmark", "natural-language-understanding", "english", "nlp"],
    isFollowed: false,
  },
  {
    id: "8",
    name: "ImageNet",
    description:
      "An image database organized according to the WordNet hierarchy, with millions of images and thousands of categories.",
    size: "155 GB",
    downloads: 2100000,
    lastUpdated: "2023-10-22",
    author: "Stanford Vision Lab",
    tags: ["image", "classification", "computer-vision", "large-scale", "vision"],
    isFollowed: false,
  },
  {
    id: "9",
    name: "MultiNLI",
    description:
      "A crowd-sourced collection of sentence pairs annotated with textual entailment information for natural language inference tasks.",
    size: "216 MB",
    downloads: 430000,
    lastUpdated: "2023-09-08",
    author: "NYU",
    tags: ["text", "natural-language-inference", "english", "nlp"],
    isFollowed: false,
  },
  {
    id: "10",
    name: "LibriSpeech",
    description:
      "LibriSpeech is a corpus of approximately 1000 hours of 16kHz read English speech derived from audiobooks from the LibriVox project.",
    size: "60 GB",
    downloads: 780000,
    lastUpdated: "2023-08-15",
    author: "Vassil Panayotov",
    tags: ["audio", "speech", "english", "asr"],
    isFollowed: false,
  },
  {
    id: "11",
    name: "CIFAR-10",
    description:
      "The CIFAR-10 dataset consists of 60000 32x32 colour images in 10 classes, with 6000 images per class.",
    size: "170 MB",
    downloads: 1850000,
    lastUpdated: "2023-07-30",
    author: "University of Toronto",
    tags: ["image", "classification", "computer-vision", "vision"],
    isFollowed: true,
  },
  {
    id: "12",
    name: "VoxCeleb",
    description: "A large-scale speaker identification dataset collected from videos uploaded to YouTube.",
    size: "40 GB",
    downloads: 320000,
    lastUpdated: "2023-10-18",
    author: "University of Oxford",
    tags: ["audio", "speaker-identification", "speech"],
    isFollowed: false,
  },
  {
    id: "13",
    name: "Kinetics-700",
    description:
      "A large-scale dataset of video clips covering 700 human action classes with at least 600 video clips for each action.",
    size: "5.2 TB",
    downloads: 180000,
    lastUpdated: "2023-11-12",
    author: "DeepMind",
    tags: ["video", "action-recognition", "human-activity"],
    isFollowed: false,
  },
  {
    id: "14",
    name: "NYC Taxi Trips",
    description:
      "A comprehensive dataset of taxi trips in New York City, including pickup and dropoff locations, times, fares, and more.",
    size: "500 GB",
    downloads: 420000,
    lastUpdated: "2023-09-25",
    author: "NYC Taxi & Limousine Commission",
    tags: ["tabular", "geospatial", "time-series", "transportation"],
    isFollowed: false,
  },
  {
    id: "15",
    name: "ShapeNet",
    description: "A richly-annotated, large-scale dataset of 3D shapes with 55 categories and 51,300 unique 3D models.",
    size: "30 GB",
    downloads: 290000,
    lastUpdated: "2023-08-05",
    author: "Stanford University",
    tags: ["3d", "shape-analysis", "computer-vision"],
    isFollowed: false,
  },
]

// Simulate API call to fetch datasets
export async function fetchDatasets(): Promise<Dataset[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return mockDatasets
}

// Simulate API call to fetch a single dataset by ID
export async function fetchDatasetById(id: string): Promise<Dataset | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  const dataset = mockDatasets.find((d) => d.id === id)
  return dataset || null
}

// Simulate API call to follow/unfollow a dataset
export async function toggleFollowDataset(id: string, follow: boolean): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return true
}

// Simulate API call to get impact assessment for a dataset
export interface ImpactAssessment {
  level: "low" | "medium" | "high"
  score: number
  factors: {
    name: string
    value: number
    description: string
  }[]
  recommendations: string[]
}

export async function getDatasetImpact(id: string): Promise<ImpactAssessment> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Mock impact assessment data
  const dataset = mockDatasets.find((d) => d.id === id)

  if (!dataset) {
    throw new Error("Dataset not found")
  }

  // Determine impact level based on dataset size and downloads
  let level: "low" | "medium" | "high" = "low"
  let score = 0

  if (dataset.downloads > 1000000) {
    level = "high"
    score = Math.floor(Math.random() * 30) + 70 // 70-100
  } else if (dataset.downloads > 500000) {
    level = "medium"
    score = Math.floor(Math.random() * 30) + 40 // 40-70
  } else {
    level = "low"
    score = Math.floor(Math.random() * 40) // 0-40
  }

  return {
    level,
    score,
    factors: [
      {
        name: "Data Size",
        value: dataset.size.includes("GB") ? 80 : 30,
        description: "The size of the dataset affects processing requirements and potential bias.",
      },
      {
        name: "Usage Frequency",
        value: Math.min(dataset.downloads / 50000, 100),
        description: "Widely used datasets have greater potential impact on AI systems.",
      },
      {
        name: "Data Diversity",
        value: Math.floor(Math.random() * 100),
        description: "Diverse datasets tend to produce more robust and fair models.",
      },
      {
        name: "Data Quality",
        value: Math.floor(Math.random() * 100),
        description: "Higher quality data leads to better model performance.",
      },
    ],
    recommendations: [
      "Consider combining with complementary datasets for improved model robustness.",
      "Implement data augmentation techniques to address potential biases.",
      "Monitor model performance across different demographic groups.",
      "Regularly update the dataset to maintain relevance and accuracy.",
    ],
  }
}
