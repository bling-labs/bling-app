import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getMypageProfile } from "./actions"
import { getSocialPlatforms } from "@/app/register/influencer/actions"
import { ProfileEditForm } from "./profile-edit-form"

export default async function MypageProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    redirect("/auth/login")
  }

  const [profile, socialPlatforms] = await Promise.all([
    getMypageProfile(user.id),
    getSocialPlatforms(),
  ])

  if (!profile) {
    redirect("/register/influencer")
  }

  return (
    <ProfileEditForm
      profile={profile}
      socialPlatforms={socialPlatforms}
    />
  )
}
