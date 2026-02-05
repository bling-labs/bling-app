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
    await prisma.$transaction(async (tx) => {
      // User 테이블 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: {
          userType: "advertiser",
          isOnboarded: true,
        },
      })

      // Advertiser 레코드 생성
      await tx.advertiser.create({
        data: {
          id: user.id,
          companyName: data.companyName,
          businessCategory: data.businessCategory,
          companyUrl: data.companyUrl || null,
          companyDescription: data.companyDescription || null,
          businessLicenseUrl: data.businessLicenseUrl,
          contactName: data.contactName,
          contactPhone: data.contactPhone,
          jobTitle: data.jobTitle || null,
        },
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다" }
  }
}
