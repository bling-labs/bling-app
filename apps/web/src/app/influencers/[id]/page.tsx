import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { InfluencerDetailClient } from "./detail-client"
import { getInfluencerDetail } from "@/data/influencer-detail"

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const detail = getInfluencerDetail(id)
  if (!detail) notFound()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <InfluencerDetailClient detail={detail} />
      </div>
      <Footer />
    </main>
  )
}
