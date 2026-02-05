import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 최초 가입 여부 확인: is_onboarded가 false면 welcome 페이지로
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const profile = await prisma.profile.findUnique({
          where: { id: user.id },
          select: { isOnboarded: true },
        })

        if (profile && !profile.isOnboarded) {
          return NextResponse.redirect(`${origin}/auth/welcome`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/auth/login`)
}
