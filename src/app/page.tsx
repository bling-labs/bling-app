import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { ValueProps } from "@/components/value-props"
import { InfluencersShowcase } from "@/components/influencers-showcase"
import { ContentsShowcase } from "@/components/contents-showcase"
import { ProcessSection } from "@/components/process-section"
import { FinalCTA } from "@/components/final-cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <ValueProps />
      <InfluencersShowcase />
      <ContentsShowcase />
      <ProcessSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
