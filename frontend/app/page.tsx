import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
