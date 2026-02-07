"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma, type Gender } from "@bling/database"

export interface BasicInfoInput {
  mobilePhone?: string
  landlinePhone?: string
  fullName: string
  nickname: string
  bio?: string
  birthDate: string // YYMMDD (6 digits)
  categories: string[]
  company?: string
  referralCode?: string
  gender: string
}

export interface SnsChannelInput {
  platform: string
  channelUrl: string
  isProfileVisible?: boolean
}

/** Parse YYMMDD (6 digits) to Date. YY: 00-50 -> 2000s, 51-99 -> 1900s */
function parseBirthDateYYMMDD(value: string): Date {
  const trimmed = value.trim().replace(/\D/g, "")
  if (trimmed.length !== 6) {
    throw new Error("생년월일 6자리를 입력해주세요")
  }
  const yy = parseInt(trimmed.slice(0, 2), 10)
  const mm = parseInt(trimmed.slice(2, 4), 10)
  const dd = parseInt(trimmed.slice(4, 6), 10)
  const fullYear = yy <= 50 ? 2000 + yy : 1900 + yy
  const date = new Date(fullYear, mm - 1, dd)
  if (isNaN(date.getTime()) || date.getFullYear() !== fullYear || date.getMonth() !== mm - 1 || date.getDate() !== dd) {
    throw new Error("올바른 생년월일을 입력해주세요")
  }
  return date
}

export async function saveInfluencerBasicInfo(data: BasicInfoInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  if (!user.email) {
    return { error: "이메일 인증이 필요합니다" }
  }

  try {
    const birthDate = parseBirthDateYYMMDD(data.birthDate)
    const defaultTier = await prisma.influencerTier.findFirst({
      where: { level: 1 },
      select: { id: true },
    })

    if (!defaultTier) {
      return { error: "티어 정보를 찾을 수 없습니다" }
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { userType: "influencer" },
      })

      const existing = await tx.influencer.findUnique({
        where: { id: user.id },
      })

      if (existing) {
        await tx.influencer.update({
          where: { id: user.id },
          data: {
            fullName: data.fullName,
            nickname: data.nickname,
            mobilePhone: data.mobilePhone || null,
            landlinePhone: data.landlinePhone || null,
            gender: data.gender as Gender,
            birthDate,
            categories: data.categories,
            bio: data.bio || null,
            company: data.company || null,
            referralCode: data.referralCode || null,
            status: "draft",
          },
        })
      } else {
        await tx.influencer.create({
          data: {
            id: user.id,
            fullName: data.fullName,
            nickname: data.nickname,
            mobilePhone: data.mobilePhone || null,
            landlinePhone: data.landlinePhone || null,
            gender: data.gender as Gender,
            birthDate,
            categories: data.categories,
            bio: data.bio || null,
            company: data.company || null,
            referralCode: data.referralCode || null,
            tierId: defaultTier.id,
            status: "draft",
          },
        })
      }
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "저장에 실패했습니다" }
  }
}

export async function completeInfluencerRegistration(channels: SnsChannelInput[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  if (!channels || channels.length === 0) {
    return { error: "SNS 채널을 최소 1개 등록해주세요" }
  }

  const validChannels = channels.filter(
    (ch) => ch.platform && ch.channelUrl && ch.channelUrl.startsWith("http")
  )
  if (validChannels.length === 0) {
    return { error: "유효한 SNS 채널을 입력해주세요" }
  }

  try {
    const existing = await prisma.influencer.findUnique({
      where: { id: user.id },
    })

    if (!existing) {
      return { error: "먼저 기본정보를 입력해주세요" }
    }

    await prisma.$transaction(async (tx) => {
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
      await tx.influencer.update({
        where: { id: user.id },
        data: { status: "pending" },
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다" }
  }
}

export async function verifyInviteCode(code: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  const trimmedCode = code.trim().toUpperCase()
  if (!trimmedCode) {
    return { error: "승인코드를 입력해주세요" }
  }

  try {
    const inviteCode = await prisma.inviteCode.findUnique({
      where: { code: trimmedCode },
    })

    if (!inviteCode) {
      return { error: "유효하지 않은 승인코드입니다" }
    }

    if (inviteCode.expiresAt && inviteCode.expiresAt < new Date()) {
      return { error: "만료된 승인코드입니다" }
    }

    if (inviteCode.maxUses && inviteCode.usedCount >= inviteCode.maxUses) {
      return { error: "사용 횟수가 초과된 승인코드입니다" }
    }

    await prisma.$transaction(async (tx) => {
      await tx.influencer.update({
        where: { id: user.id },
        data: { status: "active" },
      })
      await tx.user.update({
        where: { id: user.id },
        data: { isOnboarded: true },
      })
      await tx.inviteCode.update({
        where: { id: inviteCode.id },
        data: { usedCount: { increment: 1 } },
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "승인코드 확인에 실패했습니다" }
  }
}

export interface SocialPlatformOption {
  code: string
  label: string
}

export async function getSocialPlatforms(): Promise<{
  defaultVisible: SocialPlatformOption[]
  rest: SocialPlatformOption[]
}> {
  const all = await prisma.socialPlatform.findMany({
    orderBy: { sortOrder: "asc" },
    select: { code: true, label: true, isDefaultVisible: true },
  })
  const defaultVisible = all.filter((p) => p.isDefaultVisible).map((p) => ({ code: p.code, label: p.label }))
  const rest = all.filter((p) => !p.isDefaultVisible).map((p) => ({ code: p.code, label: p.label }))
  return { defaultVisible, rest }
}

export async function getInfluencerDraft(userId: string) {
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
      status: true,
    },
  })
  return influencer
}

const REGISTRATION_GUIDE_KEY = "influencer_registration_guide"

export async function getInfluencerRegistrationGuide(): Promise<string | null> {
  const block = await prisma.contentBlock.findUnique({
    where: { key: REGISTRATION_GUIDE_KEY },
    select: { content: true },
  })
  return block?.content ?? null
}
