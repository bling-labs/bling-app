"use server"

import { createClient } from "@/lib/supabase/server"
import { prisma, type ContentType, type ContentStatus } from "@bling/database"

export interface CreateContentInput {
  type: ContentType
  title: string
  description?: string | null
  thumbnailUrl: string
  videoUrl?: string | null
  platform: string
  status?: ContentStatus
}

export async function getMyContents(influencerId: string) {
  const contents = await prisma.influencerContent.findMany({
    where: { influencerId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      thumbnailUrl: true,
      videoUrl: true,
      platform: true,
      status: true,
      createdAt: true,
    },
  })
  return contents
}

export async function createContent(data: CreateContentInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다", id: null }
  }

  const influencer = await prisma.influencer.findUnique({
    where: { id: user.id },
    select: { id: true },
  })

  if (!influencer) {
    return { error: "인플루언서 정보가 없습니다", id: null }
  }

  if (data.type === "video" && !data.videoUrl) {
    return { error: "영상 콘텐츠는 영상 URL을 입력해주세요", id: null }
  }

  try {
    const content = await prisma.influencerContent.create({
      data: {
        influencerId: user.id,
        type: data.type,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        thumbnailUrl: data.thumbnailUrl,
        videoUrl: data.type === "video" ? data.videoUrl ?? null : null,
        platform: data.platform,
        status: data.status ?? "draft",
      },
      select: { id: true },
    })
    return { error: null, id: content.id }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "등록에 실패했습니다", id: null }
  }
}

export async function updateContent(
  contentId: string,
  data: Partial<Pick<CreateContentInput, "title" | "description" | "thumbnailUrl" | "videoUrl" | "status">>
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  const existing = await prisma.influencerContent.findFirst({
    where: { id: contentId, influencerId: user.id },
  })

  if (!existing) {
    return { error: "콘텐츠를 찾을 수 없거나 수정 권한이 없습니다" }
  }

  try {
    await prisma.influencerContent.update({
      where: { id: contentId },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description?.trim() || null }),
        ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl || null }),
        ...(data.status !== undefined && { status: data.status }),
      },
    })
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "수정에 실패했습니다" }
  }
}

export async function deleteContent(contentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "로그인이 필요합니다" }
  }

  const existing = await prisma.influencerContent.findFirst({
    where: { id: contentId, influencerId: user.id },
  })

  if (!existing) {
    return { error: "콘텐츠를 찾을 수 없거나 삭제 권한이 없습니다" }
  }

  try {
    await prisma.influencerContent.delete({
      where: { id: contentId },
    })
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "삭제에 실패했습니다" }
  }
}
