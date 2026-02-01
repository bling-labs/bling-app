import Link from "next/link"

export default async function InfluencerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await params
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground">인플루언서 상세 페이지 (추후 구현)</p>
      <Link href="/influencers" className="text-primary hover:underline">
        인플루언서 목록으로 돌아가기
      </Link>
    </main>
  )
}
