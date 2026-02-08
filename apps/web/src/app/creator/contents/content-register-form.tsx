"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { createContent } from "./actions"
import type { ContentType, ContentStatus } from "@bling/database"
import { Button, Input, Label, Textarea } from "@bling/ui"
import { Loader2, Upload, Image as ImageIcon, Video } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({
  type: z.enum(["video", "image"]),
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  platform: z.string().min(1, "플랫폼을 선택해주세요"),
  status: z.enum(["draft", "visible"]),
})

type FormData = z.infer<typeof schema>

interface ContentRegisterFormProps {
  platformOptions: { code: string; label: string }[]
}

export function ContentRegisterForm({ platformOptions }: ContentRegisterFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "video",
      title: "",
      description: "",
      platform: platformOptions[0]?.code ?? "youtube",
      status: "draft",
    },
  })

  const type = form.watch("type")

  const handleSubmit = async (data: FormData) => {
    setServerError(null)

    if (!thumbnailFile) {
      setServerError("썸네일 이미지를 선택해주세요")
      return
    }
    if (data.type === "video" && !videoFile) {
      setServerError("영상 파일을 선택해주세요")
      return
    }

    setUploading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      setServerError("로그인이 필요합니다")
      setUploading(false)
      return
    }

    const prefix = `contents/${user.id}/${Date.now()}`

    const thumbExt = thumbnailFile.name.split(".").pop() || "jpg"
    const thumbPath = `${prefix}-thumb.${thumbExt}`
    const { error: thumbError } = await supabase.storage
      .from("documents")
      .upload(thumbPath, thumbnailFile, { upsert: true })

    if (thumbError) {
      setServerError(`썸네일 업로드 실패: ${thumbError.message}`)
      setUploading(false)
      return
    }

    const { data: thumbUrlData } = supabase.storage.from("documents").getPublicUrl(thumbPath)
    let videoUrl: string | null = null

    if (data.type === "video" && videoFile) {
      const videoExt = videoFile.name.split(".").pop() || "mp4"
      const videoPath = `${prefix}-video.${videoExt}`
      const { error: videoError } = await supabase.storage
        .from("documents")
        .upload(videoPath, videoFile, { upsert: true })
      if (videoError) {
        setServerError(`영상 업로드 실패: ${videoError.message}`)
        setUploading(false)
        return
      }
      const { data: videoUrlData } = supabase.storage.from("documents").getPublicUrl(videoPath)
      videoUrl = videoUrlData.publicUrl
    }

    const { error, id } = await createContent({
      type: data.type as ContentType,
      title: data.title,
      description: data.description || null,
      thumbnailUrl: thumbUrlData.publicUrl,
      videoUrl,
      platform: data.platform,
      status: data.status as ContentStatus,
    })

    setUploading(false)
    if (error) {
      setServerError(error)
      return
    }
    toast.success("콘텐츠가 등록되었습니다")
    router.push("/creator/contents")
    router.refresh()
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="rounded-xl border border-border bg-card p-6 space-y-6"
    >
      <div className="space-y-2">
        <Label>콘텐츠 유형 *</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="video"
              {...form.register("type")}
              className="rounded-full border-input"
            />
            <Video className="w-4 h-4" />
            영상
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="image"
              {...form.register("type")}
              className="rounded-full border-input"
            />
            <ImageIcon className="w-4 h-4" />
            이미지
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">제목 *</Label>
        <Input
          id="title"
          placeholder="콘텐츠 제목"
          {...form.register("title")}
        />
        {form.formState.errors.title && (
          <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 (선택)</Label>
        <Textarea
          id="description"
          rows={3}
          placeholder="콘텐츠에 대한 간단한 설명"
          {...form.register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label>썸네일 이미지 *</Label>
        <div className="flex items-center gap-4">
          <input
            ref={thumbnailInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => thumbnailInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {thumbnailFile ? thumbnailFile.name : "썸네일 선택"}
          </Button>
        </div>
      </div>

      {type === "video" && (
        <div className="space-y-2">
          <Label>영상 파일 *</Label>
          <div className="flex items-center gap-4">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => videoInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {videoFile ? videoFile.name : "영상 선택"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="platform">플랫폼 *</Label>
        <select
          id="platform"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("platform")}
        >
          {platformOptions.map((p) => (
            <option key={p.code} value={p.code}>
              {p.label}
            </option>
          ))}
        </select>
        {form.formState.errors.platform && (
          <p className="text-sm text-destructive">{form.formState.errors.platform.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>노출 상태</Label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          {...form.register("status")}
        >
          <option value="draft">비공개 (초안)</option>
          <option value="visible">노출 (광고주 검색 대상)</option>
        </select>
      </div>

      {serverError && (
        <p className="text-sm text-destructive">{serverError}</p>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/creator/contents")}
        >
          취소
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting || uploading}>
          {form.formState.isSubmitting || uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "등록하기"
          )}
        </Button>
      </div>
    </form>
  )
}
