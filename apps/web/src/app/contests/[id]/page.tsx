import { notFound } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContestDetailClient } from "./contest-detail-client"
import { getContestDetail } from "@/data/contest-detail"
import type { Metadata } from "next"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const contest = getContestDetail(id)
  if (!contest) return { title: "컨테스트 | Bling" }
  const description =
    contest.summary.length > 150
      ? `${contest.summary.slice(0, 150)}...`
      : contest.summary
  return {
    title: `${contest.title} | Bling 컨테스트`,
    description,
  }
}

export default async function ContestDetailPage({ params }: Props) {
  const { id } = await params
  const contest = getContestDetail(id)
  if (!contest) notFound()

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <ContestDetailClient contest={contest} />
      </div>
      <Footer />
    </main>
  )
}
