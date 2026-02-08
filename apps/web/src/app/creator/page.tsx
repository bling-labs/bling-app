import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"
import { User, Image, ArrowRight } from "lucide-react"

export default async function MypageDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) return null

  const influencer = await prisma.influencer.findUnique({
    where: { id: user.id },
    select: {
      nickname: true,
      avatarUrl: true,
      status: true,
      _count: { select: { contents: true } },
    },
  })

  if (!influencer) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
        <p className="mt-1 text-muted-foreground">
          {influencer.nickname}님의 프로필과 콘텐츠를 관리하세요.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/creator/profile"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground">프로필 관리</h2>
            <p className="text-sm text-muted-foreground">
              기본 정보, SNS 채널, 프로필 사진을 수정할 수 있습니다.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>

        <Link
          href="/creator/contents"
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/50"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Image className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground">콘텐츠</h2>
            <p className="text-sm text-muted-foreground">
              등록된 콘텐츠 {influencer._count.contents}개 · 새 콘텐츠를 등록하거나
              수정할 수 있습니다.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          프로필 상태:{" "}
          <span className="font-medium text-foreground">
            {influencer.status === "draft"
              ? "등록 중"
              : influencer.status === "applied"
                ? "승인 대기"
                : influencer.status === "active"
                  ? "노출 중"
                  : influencer.status}
          </span>
        </p>
      </div>
    </div>
  )
}
