import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return NextResponse.json({ userType: null, displayName: null }, { status: 200 })
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      userType: true,
      influencer: { select: { nickname: true } },
      advertiser: { select: { contactName: true } },
    },
  })

  if (!dbUser) {
    return NextResponse.json({ userType: null, displayName: user.email ?? null }, { status: 200 })
  }

  const displayName =
    dbUser.userType === "influencer"
      ? dbUser.influencer?.nickname ?? user.email ?? "크리에이터"
      : dbUser.userType === "advertiser"
        ? dbUser.advertiser?.contactName ?? user.email ?? "광고주"
        : user.email ?? null

  return NextResponse.json({
    userType: dbUser.userType,
    displayName,
  })
}
