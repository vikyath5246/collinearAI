import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Database, Users, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="bg-white dark:bg-collinear-darkBlue py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-collinear-darkBlue dark:text-white">
              Your AI <span className="text-collinear-orange">Improved</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 text-lg">
              Explore public datasets available on Hugging Face and discover their impact on AI development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link href="/datasets">
                <Button className="bg-collinear-orange hover:bg-collinear-orange/90 text-white px-6 py-2 rounded-md">
                  Explore Datasets <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" className="px-6 py-2">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-collinear-navy">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-collinear-darkBlue dark:text-white">
            Unleashing the Full Potential of AI
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white dark:bg-collinear-darkBlue rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-collinear-orange/10 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-collinear-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-collinear-darkBlue dark:text-white">Dataset Exploration</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse and search through public Hugging Face datasets with detailed information.
              </p>
            </div>
            <div className="bg-white dark:bg-collinear-darkBlue rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-collinear-orange/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-collinear-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-collinear-darkBlue dark:text-white">User Profiles</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create an account to follow datasets and access personalized features.
              </p>
            </div>
            <div className="bg-white dark:bg-collinear-darkBlue rounded-lg p-6 shadow-md">
              <div className="w-12 h-12 bg-collinear-orange/10 rounded-full flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-collinear-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-collinear-darkBlue dark:text-white">Impact Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Analyze dataset impact using advanced methods and clustering algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-collinear-darkBlue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-collinear-darkBlue dark:text-white">
            Ready to explore datasets?
          </h2>
          <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-300 mb-8">
            Sign up today and start exploring the vast collection of Hugging Face datasets.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-collinear-orange hover:bg-collinear-orange/90 text-white px-8 py-3 rounded-md">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
