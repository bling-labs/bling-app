import Link from "next/link"

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await params
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground">콘텐츠 상세 페이지 (추후 구현)</p>
      <Link
        href="/contents"
        className="text-primary hover:underline"
      >
        콘텐츠 목록으로 돌아가기
      </Link>
    </main>
  )
}
