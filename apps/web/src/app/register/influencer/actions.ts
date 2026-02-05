"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"

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
    await prisma.$transaction(async (tx) => {
      // 프로필 업데이트
      await tx.profile.update({
        where: { id: user.id },
        data: {
          userType: "influencer",
          fullName: data.fullName,
          nickname: data.nickname,
          phone: data.phone,
          gender: data.gender,
          birthDate: new Date(data.birthDate),
          categories: data.categories,
          bio: data.bio || null,
          isOnboarded: true,
        },
      })

      // SNS 채널 등록
      await tx.snsChannel.createMany({
        data: data.snsChannels.map((ch) => ({
          profileId: user.id,
          platform: ch.platform,
          channelUrl: ch.channelUrl,
          followerCount: ch.followerCount
            ? parseInt(ch.followerCount, 10)
            : null,
        })),
      })
    })

    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다" }
  }
}
