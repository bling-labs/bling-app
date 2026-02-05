"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

interface RegisterAdvertiserInput {
  companyName: string
  contactName: string
  contactPhone: string
  jobTitle?: string
  businessCategory: string
  companyUrl?: string
  companyDescription?: string
  businessLicenseUrl: string | null
}

export async function registerAdvertiser(data: RegisterAdvertiserInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  try {
    await prisma.profile.update({
      where: { id: user.id },
      data: {
        userType: "advertiser",
        fullName: data.contactName,
        phone: data.contactPhone,
        companyName: data.companyName,
        jobTitle: data.jobTitle || null,
        businessCategory: data.businessCategory,
        companyUrl: data.companyUrl || null,
        businessLicenseUrl: data.businessLicenseUrl,
        companyDescription: data.companyDescription || null,
        isOnboarded: true,
      },
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다" }
  }
}
