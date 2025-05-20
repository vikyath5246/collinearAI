import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#0f1e3d]">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Your AI <span className="text-orange-500 inline-block">Improved</span>
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Explore, analyze, and leverage Hugging Face datasets with our powerful exploration tool. Gain insights
                and improve your AI systems with confidence.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/datasets">
                <Button className="bg-orange-500 hover:bg-orange-600">Explore Datasets</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="border-white hover:bg-white/10">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] lg:h-full">
            {/* Database/Dataset visualization */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-40 border-2 border-orange-500 rounded-md bg-white/10 flex flex-col overflow-hidden">
              {/* Database header */}
              <div className="bg-orange-500 h-6 w-full flex items-center px-2">
                <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              {/* Data rows */}
              <div className="flex-1 p-2 flex flex-col gap-2">
                <div className="h-3 bg-white/20 rounded-sm w-full"></div>
                <div className="h-3 bg-white/30 rounded-sm w-5/6"></div>
                <div className="h-3 bg-white/20 rounded-sm w-full"></div>
                <div className="h-3 bg-white/30 rounded-sm w-4/6"></div>
                <div className="h-3 bg-white/20 rounded-sm w-full"></div>
              </div>
            </div>

            {/* Floating data points */}
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-orange-300 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border border-orange-400 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
              </div>
            </div>

            {/* Data connection lines */}
            <div className="absolute top-1/2 left-1/3 w-1 h-16 bg-orange-500/30 rotate-45"></div>
            <div className="absolute bottom-1/3 right-1/3 w-1 h-24 bg-orange-500/30 -rotate-12"></div>

            {/* Small data nodes */}
            <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-white/10 border border-orange-300 rounded-md"></div>
            <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-orange-500/40 rounded-full"></div>
            <div className="absolute top-2/3 right-1/3 w-5 h-5 bg-white/20 rounded-sm rotate-12"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
