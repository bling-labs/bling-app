import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default async function ContestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <Link
            href="/contests"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            컨테스트 목록으로
          </Link>
          <div className="py-24 text-center">
            <p className="text-muted-foreground">컨테스트 상세 페이지 (추후 구현 예정)</p>
            <p className="mt-2 text-sm text-muted-foreground">ID: {id}</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
