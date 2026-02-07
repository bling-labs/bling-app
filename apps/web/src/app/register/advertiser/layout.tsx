import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"
import { AlreadyRegisteredRedirect } from "./already-registered-redirect"
import { DraftInfluencerWarning } from "./draft-influencer-warning"
import { InfluencerRegisteredRedirect } from "./influencer-registered-redirect"

export default async function AdvertiserRegisterLayout({
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
      isOnboarded: true,
      influencer: { select: { status: true } },
    },
  })

  if (dbUser?.isOnboarded) {
    return <AlreadyRegisteredRedirect />
  }

  if (dbUser?.influencer) {
    if (dbUser.influencer.status === "draft") {
      return <DraftInfluencerWarning>{children}</DraftInfluencerWarning>
    }
    return <InfluencerRegisteredRedirect />
  }

  return <>{children}</>
}
