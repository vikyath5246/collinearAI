import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-collinear-darkBlue dark:text-white mb-6">About Dataset Explorer</h1>

        <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-collinear-darkBlue dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Dataset Explorer is a powerful tool designed to help researchers, data scientists, and AI practitioners
            discover, analyze, and leverage public datasets available on Hugging Face. Our mission is to make dataset
            exploration more accessible and insightful, enabling better AI development through informed dataset
            selection.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            By providing detailed information about datasets, including their size, content, and potential impact, we
            aim to help users make more informed decisions about which datasets to use for their AI projects.
          </p>
        </div>

        <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-collinear-darkBlue dark:text-white mb-4">Key Features</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-collinear-orange/10 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-collinear-orange font-bold text-sm">1</span>
              </div>
              <span>
                <strong className="text-collinear-darkBlue dark:text-white">Dataset Exploration:</strong> Browse and
                search through thousands of public datasets from Hugging Face.
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-collinear-orange/10 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-collinear-orange font-bold text-sm">2</span>
              </div>
              <span>
                <strong className="text-collinear-darkBlue dark:text-white">Impact Assessment:</strong> Understand the
                potential impact of datasets on AI models and applications.
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-collinear-orange/10 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-collinear-orange font-bold text-sm">3</span>
              </div>
              <span>
                <strong className="text-collinear-darkBlue dark:text-white">Dataset Following:</strong> Keep track of
                datasets that interest you for future reference.
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-collinear-orange/10 flex items-center justify-center mr-3 mt-0.5">
                <span className="text-collinear-orange font-bold text-sm">4</span>
              </div>
              <span>
                <strong className="text-collinear-darkBlue dark:text-white">Detailed Information:</strong> Access
                comprehensive metadata about each dataset, including size, samples, and download statistics.
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-collinear-navy rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-collinear-darkBlue dark:text-white mb-4">Get Started</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to explore datasets? Create an account to access all features or start browsing datasets right away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup">
              <Button className="bg-collinear-orange hover:bg-collinear-orange/90 text-white w-full sm:w-auto">
                Create an Account
              </Button>
            </Link>
            <Link href="/datasets">
              <Button variant="outline" className="w-full sm:w-auto">
                Browse Datasets
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center text-gray-600 dark:text-gray-300 text-sm">
          <p>Dataset Explorer is a product of Collinear AI. &copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
