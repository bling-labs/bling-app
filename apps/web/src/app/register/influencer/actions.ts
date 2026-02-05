"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma, type Gender } from "@bling/database"

interface RegisterInfluencerInput {
  fullName: string
  nickname: string
  phone: string
  gender: string
  birthDate: string
  categories: string[]
  bio?: string
  snsChannels: {
    platform: string
    channelUrl: string
    followerCount?: string
  }[]
}

export async function registerInfluencer(data: RegisterInfluencerInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  try {
    // 기본 티어(Bronze) 가져오기
    const defaultTier = await prisma.influencerTier.findFirst({
      where: { level: 1 },
      select: { id: true },
    })

    if (!defaultTier) {
      return { error: "티어 정보를 찾을 수 없습니다" }
    }

    await prisma.$transaction(async (tx) => {
      // User 테이블 업데이트
      await tx.user.update({
        where: { id: user.id },
        data: {
          userType: "influencer",
          isOnboarded: true,
        },
      })

      // Influencer 레코드 생성
      await tx.influencer.create({
        data: {
          id: user.id,
          fullName: data.fullName,
          nickname: data.nickname,
          phone: data.phone,
          gender: data.gender as Gender,
          birthDate: new Date(data.birthDate),
          categories: data.categories,
          bio: data.bio || null,
          tierId: defaultTier.id,
          snsChannels: {
            create: data.snsChannels.map((ch) => ({
              platform: ch.platform,
              channelUrl: ch.channelUrl,
              followerCount: ch.followerCount
                ? parseInt(ch.followerCount, 10)
                : null,
            })),
          },
        },
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다" }
  }
}
