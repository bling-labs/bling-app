"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerInfluencer } from "./actions"
import { Button, Input, Label, Textarea } from "@bling/ui"
import { Sparkles, Plus, X, Loader2 } from "lucide-react"

const CATEGORIES = [
  "뷰티",
  "패션",
  "맛집/음식",
  "여행",
  "라이프스타일",
  "IT/테크",
  "게임",
  "스포츠",
  "교육",
  "육아",
  "반려동물",
  "엔터테인먼트",
] as const

const PLATFORMS = [
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "blog", label: "블로그" },
] as const

const influencerSchema = z.object({
  fullName: z.string().min(1, "이름을 입력해주세요"),
  nickname: z.string().min(1, "활동명을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, "올바른 전화번호 형식을 입력해주세요"),
  gender: z.enum(["male", "female", "other"], {
    error: "성별을 선택해주세요",
  }),
  birthDate: z.string().min(1, "생년월일을 입력해주세요"),
  categories: z
    .array(z.string())
    .min(1, "카테고리를 최소 1개 선택해주세요"),
  snsChannels: z
    .array(
      z.object({
        platform: z.string().min(1, "플랫폼을 선택해주세요"),
        channelUrl: z.string().url("올바른 URL을 입력해주세요"),
        followerCount: z.string().optional(),
      })
    )
    .min(1, "SNS 채널을 최소 1개 등록해주세요"),
  bio: z.string().optional(),
})

type InfluencerFormData = z.infer<typeof influencerSchema>

export default function RegisterInfluencerPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InfluencerFormData>({
    resolver: zodResolver(influencerSchema),
    defaultValues: {
      categories: [],
      snsChannels: [{ platform: "", channelUrl: "", followerCount: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "snsChannels",
  })

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    setValue("categories", updated, { shouldValidate: true })
  }

  const onSubmit = async (data: InfluencerFormData) => {
    setServerError(null)

    const { error } = await registerInfluencer(data)

    if (error) {
      setServerError(error)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
          <h1 className="text-2xl font-bold">인플루언서 등록</h1>
          <p className="text-muted-foreground">
            인플루언서 활동에 필요한 정보를 입력해주세요
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">기본 정보</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">이름 (실명) *</Label>
                <Input
                  id="fullName"
                  placeholder="홍길동"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">활동명/닉네임 *</Label>
                <Input
                  id="nickname"
                  placeholder="채널에서 사용하는 이름"
                  {...register("nickname")}
                />
                {errors.nickname && (
                  <p className="text-sm text-destructive">
                    {errors.nickname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">연락처 *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-1234-5678"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">성별 *</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register("gender")}
                  defaultValue=""
                >
                  <option value="" disabled>
                    선택해주세요
                  </option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">선택안함</option>
                </select>
                {errors.gender && (
                  <p className="text-sm text-destructive">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">생년월일 *</Label>
              <Input
                id="birthDate"
                type="date"
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">
                  {errors.birthDate.message}
                </p>
              )}
            </div>
          </div>

          {/* 카테고리 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">활동 카테고리 *</h2>
            <p className="text-sm text-muted-foreground">
              관련 카테고리를 선택해주세요 (복수 선택 가능)
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedCategories.includes(category)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-destructive">
                {errors.categories.message}
              </p>
            )}
          </div>

          {/* SNS 채널 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">SNS 채널 *</h2>
                <p className="text-sm text-muted-foreground">
                  활동 중인 SNS 채널을 등록해주세요 (최소 1개)
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ platform: "", channelUrl: "", followerCount: "" })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    채널 {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>플랫폼</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      {...register(`snsChannels.${index}.platform`)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        선택
                      </option>
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    {errors.snsChannels?.[index]?.platform && (
                      <p className="text-xs text-destructive">
                        {errors.snsChannels[index].platform?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>채널 URL</Label>
                    <Input
                      placeholder="https://..."
                      {...register(`snsChannels.${index}.channelUrl`)}
                    />
                    {errors.snsChannels?.[index]?.channelUrl && (
                      <p className="text-xs text-destructive">
                        {errors.snsChannels[index].channelUrl?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label>팔로워 수</Label>
                    <Input
                      type="number"
                      placeholder="선택사항"
                      {...register(`snsChannels.${index}.followerCount`)}
                    />
                  </div>
                </div>
              </div>
            ))}
            {errors.snsChannels?.root && (
              <p className="text-sm text-destructive">
                {errors.snsChannels.root.message}
              </p>
            )}
          </div>

          {/* 자기소개 */}
          <div className="space-y-2">
            <Label htmlFor="bio">자기소개 (선택)</Label>
            <Textarea
              id="bio"
              placeholder="간단한 자기소개를 작성해주세요"
              rows={4}
              {...register("bio")}
            />
          </div>

          {serverError && (
            <p className="text-sm text-destructive text-center">
              {serverError}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              뒤로가기
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "등록 완료"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
