import Link from "next/link"
import { redirect } from "next/navigation"
import { Sparkles, User, Building2, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

export default async function WelcomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // 이미 온보딩 완료한 유저는 홈으로
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isOnboarded: true },
  })

  if (dbUser?.isOnboarded) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">환영합니다!</h1>
          <p className="text-muted-foreground text-lg">
            Bling에 가입해주셔서 감사합니다.
            <br />
            어떤 활동을 시작하시겠어요?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/register/influencer"
            className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors space-y-4"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">인플루언서</h2>
              <p className="text-sm text-muted-foreground">
                SNS 채널을 활용해 다양한 캠페인에 참여하고 수익을 창출하세요
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-primary font-medium">
              등록하기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/register/advertiser"
            className="group bg-card border border-border rounded-xl p-6 hover:border-secondary/50 transition-colors space-y-4"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-secondary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-bold">광고주</h2>
              <p className="text-sm text-muted-foreground">
                브랜드와 제품을 인플루언서를 통해 효과적으로 홍보하세요
              </p>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary font-medium">
              등록하기
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="text-center">
          <SkipOnboardingButton />
        </div>
      </div>
    </div>
  )
}

function SkipOnboardingButton() {
  return (
    <form
      action={async () => {
        "use server"
        const supabase = await createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isOnboarded: true },
          })
        }
        redirect("/")
      }}
    >
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        나중에 할게요
      </button>
    </form>
  )
}
