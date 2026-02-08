import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

export default async function AdvertiserLayout({
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
      advertiser: { select: { id: true } },
      influencer: { select: { id: true } },
    },
  })

  if (dbUser?.userType === "influencer") {
    redirect("/creator")
  }

  if (!dbUser?.advertiser) {
    redirect("/register/advertiser")
  }

  return <>{children}</>
}
