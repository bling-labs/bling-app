import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"
import { User, Image, LayoutDashboard } from "lucide-react"

export default async function MypageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      userType: true,
      influencer: { select: { id: true } },
      advertiser: { select: { id: true } },
    },
  })

  if (dbUser?.userType === "advertiser") {
    redirect("/register/advertiser")
  }

  if (!dbUser?.influencer) {
    redirect("/register/influencer")
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="flex gap-4 border-b border-border pb-4 mb-8">
          <Link
            href="/creator"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            대시
          </Link>
          <Link
            href="/creator/profile"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <User className="w-4 h-4" />
            프로필
          </Link>
          <Link
            href="/creator/contents"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Image className="w-4 h-4" />
            콘텐츠
          </Link>
        </nav>
        {children}
      </div>
    </div>
  )
}
