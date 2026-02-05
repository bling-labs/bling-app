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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // User 레코드가 없으면 생성
        let dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isOnboarded: true },
        })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              id: user.id,
              email: user.email,
              isOnboarded: false,
            },
            select: { isOnboarded: true },
          })
        }

        // 온보딩 안됐으면 welcome 페이지로
        if (!dbUser.isOnboarded) {
          return NextResponse.redirect(`${origin}/auth/welcome`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시 로그인 페이지로
  return NextResponse.redirect(`${origin}/auth/login`)
}
