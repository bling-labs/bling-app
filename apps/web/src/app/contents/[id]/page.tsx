import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContentDetailClient } from "./content-detail-client"
import { getContentDetail } from "@/data/content-detail"

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const content = getContentDetail(id)
  if (!content) notFound()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContentDetailClient content={content} />
      </div>
      <Footer />
    </main>
  )
}
