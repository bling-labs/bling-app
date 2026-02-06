import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"
import { RegisterInfluencerForm } from "./register-influencer-form"
import { getInfluencerDraft, getInfluencerRegistrationGuide, getSocialPlatforms } from "./actions"

export default async function RegisterInfluencerPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!user.email) {
    redirect("/auth/verify-email")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isOnboarded: true },
  })

  if (dbUser?.isOnboarded) {
    redirect("/")
  }

  const [draft, socialPlatforms, guideContent] = await Promise.all([
    getInfluencerDraft(user.id),
    getSocialPlatforms(),
    getInfluencerRegistrationGuide(),
  ])

  let initialStep: 0 | 1 | 2 = 0
  if (draft?.status === "draft") {
    initialStep = 2
  }

  return (
    <RegisterInfluencerForm
      userEmail={user.email}
      initialStep={initialStep}
      guideHtml={guideContent}
      socialPlatforms={socialPlatforms}
      draftBasicInfo={
        draft
          ? {
              fullName: draft.fullName,
              nickname: draft.nickname,
              mobilePhone: draft.mobilePhone,
              landlinePhone: draft.landlinePhone,
              gender: draft.gender,
              birthDate: draft.birthDate,
              categories: draft.categories,
              bio: draft.bio,
              company: draft.company,
              referralCode: draft.referralCode,
            }
          : null
      }
    />
  )
}
