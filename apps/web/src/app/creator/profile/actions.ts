"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma, type Gender } from "@bling/database"
import type { BasicInfoInput, SnsChannelInput } from "@/app/register/influencer/actions"

/** YYMMDD (6자리) → Date. 00–50 → 2000년대, 51–99 → 1900년대 */
function parseBirthDateYYMMDD(value: string): Date {
  const trimmed = value.trim().replace(/\D/g, "")
  if (trimmed.length !== 6) throw new Error("생년월일 6자리를 입력해주세요")
  const yy = parseInt(trimmed.slice(0, 2), 10)
  const mm = parseInt(trimmed.slice(2, 4), 10)
  const dd = parseInt(trimmed.slice(4, 6), 10)
  const fullYear = yy <= 50 ? 2000 + yy : 1900 + yy
  const date = new Date(fullYear, mm - 1, dd)
  if (
    isNaN(date.getTime()) ||
    date.getFullYear() !== fullYear ||
    date.getMonth() !== mm - 1 ||
    date.getDate() !== dd
  ) {
    throw new Error("올바른 생년월일을 입력해주세요")
  }
  return date
}

export interface MypageProfileData {
  fullName: string
  nickname: string
  mobilePhone: string | null
  landlinePhone: string | null
  gender: string
  birthDate: Date
  categories: string[]
  bio: string | null
  company: string | null
  referralCode: string | null
  avatarUrl: string | null
  snsChannels: { platform: string; channelUrl: string; isProfileVisible: boolean }[]
}

export async function getMypageProfile(userId: string): Promise<MypageProfileData | null> {
  const influencer = await prisma.influencer.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      nickname: true,
      mobilePhone: true,
      landlinePhone: true,
      gender: true,
      birthDate: true,
      categories: true,
      bio: true,
      company: true,
      referralCode: true,
      avatarUrl: true,
      snsChannels: {
        select: { platform: true, channelUrl: true, isProfileVisible: true },
      },
    },
  })
  if (!influencer) return null
  return {
    ...influencer,
    gender: influencer.gender,
    snsChannels: influencer.snsChannels.map((ch) => ({
      platform: ch.platform,
      channelUrl: ch.channelUrl,
      isProfileVisible: ch.isProfileVisible,
    })),
  }
}

export async function updateMypageProfile(
  basicInfo: BasicInfoInput & { avatarUrl?: string | null },
  snsChannels: SnsChannelInput[]
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  const validChannels = snsChannels.filter(
    (ch) => ch.platform && ch.channelUrl && ch.channelUrl.startsWith("http")
  )
  if (validChannels.length === 0) {
    return { error: "SNS 채널을 최소 1개 등록해주세요" }
  }

  try {
    const birthDate = parseBirthDateYYMMDD(basicInfo.birthDate)

    await prisma.$transaction(async (tx) => {
      await tx.influencer.update({
        where: { id: user.id },
        data: {
          fullName: basicInfo.fullName,
          nickname: basicInfo.nickname,
          mobilePhone: basicInfo.mobilePhone || null,
          landlinePhone: basicInfo.landlinePhone || null,
          gender: basicInfo.gender as Gender,
          birthDate,
          categories: basicInfo.categories,
          bio: basicInfo.bio || null,
          company: basicInfo.company || null,
          referralCode: basicInfo.referralCode || null,
          ...(basicInfo.avatarUrl !== undefined && { avatarUrl: basicInfo.avatarUrl || null }),
        },
      })
      await tx.snsChannel.deleteMany({
        where: { influencerId: user.id },
      })
      await tx.snsChannel.createMany({
        data: validChannels.map((ch) => ({
          influencerId: user.id,
          platform: ch.platform,
          channelUrl: ch.channelUrl,
          isProfileVisible: ch.isProfileVisible ?? true,
        })),
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "저장에 실패했습니다" }
  }
}
