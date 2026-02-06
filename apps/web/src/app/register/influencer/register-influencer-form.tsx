"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  saveInfluencerBasicInfo,
  completeInfluencerRegistration,
  type BasicInfoInput,
  type SocialPlatformOption,
} from "./actions"
import { Button, Input, Label, Textarea } from "@bling/ui"
import { Sparkles, Plus, X, Loader2, Check, Minus } from "lucide-react"
import { SignupProgress } from "@/components/auth/signup-progress"

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

const basicInfoSchema = z.object({
  mobilePhone: z.string().optional(),
  landlinePhone: z.string().optional(),
  fullName: z.string().min(1, "이름을 입력해주세요"),
  nickname: z.string().min(1, "활동명을 입력해주세요"),
  bio: z.string().max(80, "80자 이내로 입력해주세요").optional(),
  birthDate: z
    .string()
    .transform((s) => s.replace(/\D/g, ""))
    .pipe(
      z
        .string()
        .length(6, "생년월일 6자리를 입력해주세요 (예: 950315)")
        .regex(/^\d{6}$/)
    ),
  categories: z.array(z.string()).min(1, "카테고리를 최소 1개 선택해주세요"),
  company: z.string().optional(),
  referralCode: z.string().optional(),
  gender: z.string().min(1, "성별을 선택해주세요"),
})

const snsChannelsSchema = z.object({
  snsChannels: z
    .array(
      z.object({
        platform: z.string().min(1, "플랫폼을 선택해주세요"),
        channelUrl: z.string().url("올바른 URL을 입력해주세요"),
        followerCount: z.string().optional(),
      })
    )
    .min(1, "SNS 채널을 최소 1개 등록해주세요"),
})

type BasicInfoFormData = z.infer<typeof basicInfoSchema>
type SnsChannelsFormData = z.infer<typeof snsChannelsSchema>

interface RegisterInfluencerFormProps {
  userEmail: string
  initialStep: 0 | 1 | 2
  guideHtml: string | null
  socialPlatforms: {
    defaultVisible: SocialPlatformOption[]
    rest: SocialPlatformOption[]
  }
  draftBasicInfo?: {
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
  } | null
}

function formatBirthDateToYYMMDD(date: Date): string {
  const y = date.getFullYear() % 100
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
}

export function RegisterInfluencerForm({
  userEmail,
  initialStep,
  guideHtml,
  socialPlatforms,
  draftBasicInfo,
}: RegisterInfluencerFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<0 | 1 | 2>(initialStep)
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    draftBasicInfo?.categories ?? []
  )
  const [platformExpandedByChannel, setPlatformExpandedByChannel] = useState<Record<number, boolean>>({})
  const defaultPlatforms = socialPlatforms.defaultVisible.length > 0
    ? socialPlatforms.defaultVisible
    : [{ code: "youtube", label: "유튜브" }, { code: "instagram", label: "인스타그램" }, { code: "tiktok", label: "틱톡" }]
  const restPlatforms = socialPlatforms.rest ?? []
  const defaultPlatformCode = defaultPlatforms[0]?.code ?? "youtube"

  const basicForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      mobilePhone: draftBasicInfo?.mobilePhone ?? "",
      landlinePhone: draftBasicInfo?.landlinePhone ?? "",
      fullName: draftBasicInfo?.fullName ?? "",
      nickname: draftBasicInfo?.nickname ?? "",
      bio: draftBasicInfo?.bio ?? "",
      birthDate: draftBasicInfo?.birthDate
        ? formatBirthDateToYYMMDD(draftBasicInfo.birthDate)
        : "",
      categories: draftBasicInfo?.categories ?? [],
      company: draftBasicInfo?.company ?? "",
      referralCode: draftBasicInfo?.referralCode ?? "",
      gender: (draftBasicInfo?.gender as "male" | "female" | "other") ?? "",
    },
  })

  const snsForm = useForm<SnsChannelsFormData>({
    resolver: zodResolver(snsChannelsSchema),
    defaultValues: {
      snsChannels: [{ platform: defaultPlatformCode, channelUrl: "", followerCount: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: snsForm.control,
    name: "snsChannels",
  })

  useEffect(() => {
    setSelectedCategories(draftBasicInfo?.categories ?? [])
  }, [draftBasicInfo?.categories])

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : selectedCategories.length < 3
        ? [...selectedCategories, category]
        : selectedCategories
    setSelectedCategories(updated)
    basicForm.setValue("categories", updated, { shouldValidate: true })
  }

  const basicFormValues = basicForm.watch()
  const isBasicInfoComplete =
    !!basicFormValues.fullName &&
    !!basicFormValues.nickname &&
    !!basicFormValues.birthDate &&
    basicFormValues.birthDate.length === 6 &&
    basicFormValues.categories?.length >= 1 &&
    !!userEmail

  const snsFormValues = snsForm.watch("snsChannels")
  const validChannels = snsFormValues?.filter(
    (ch) => ch.platform && ch.channelUrl?.startsWith("http")
  ) ?? []
  const isSocialComplete = validChannels.length >= 1

  const handleNextToSocial = basicForm.handleSubmit(async (data) => {
    setServerError(null)
    const input: BasicInfoInput = {
      ...data,
      birthDate: String(data.birthDate).replace(/\D/g, "").slice(0, 6),
      gender: data.gender || "other",
    }
    const { error } = await saveInfluencerBasicInfo(input)
    if (error) {
      setServerError(error)
      return
    }
    setStep(2)
  })

  const handleComplete = snsForm.handleSubmit(async (data) => {
    setServerError(null)
    const { error } = await completeInfluencerRegistration(data.snsChannels)
    if (error) {
      setServerError(error)
      return
    }
    router.push("/")
    router.refresh()
  })

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
        </div>

        <SignupProgress currentStep={2} userType="influencer" />

        <div className="flex gap-8">
          {/* 좌측 사이드바 */}
          <aside className="w-48 shrink-0 space-y-2">
            <SidebarStep
              title="안내사항"
              status={step > 0 ? "complete" : step === 0 ? "active" : "pending"}
              description={step > 0 ? "확인 완료" : "등록 전 안내"}
            />
            <SidebarStep
              title="기본 정보"
              status={isBasicInfoComplete ? "complete" : step === 1 ? "active" : "pending"}
              description={isBasicInfoComplete ? "입력 완료" : "필수 항목 입력"}
            />
            <SidebarStep
              title="소셜 채널"
              status={isSocialComplete ? "complete" : step === 2 ? "active" : "pending"}
              description={isSocialComplete ? "입력 완료" : "최소 1개 필요"}
            />
          </aside>

          {/* 우측 폼 카드 */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-xl p-6">
              {step === 0 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      인플루언서
                    </span>
                    <h2 className="text-lg font-semibold">안내사항</h2>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert max-wnone text-foreground [&_ul]:my-2 [&_p]:my-2 [&_h3]:mt-4 [&_h3]:mb-2"
                    dangerouslySetInnerHTML={{
                      __html: guideHtml ?? "<p>안내 내용이 없습니다. 확인을 눌러 진행해주세요.</p>",
                    }}
                  />
                  <div className="flex gap-3 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      ← 이전
                    </Button>
                    <Button
                      type="button"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                      onClick={() => setStep(1)}
                    >
                      확인
                    </Button>
                  </div>
                </>
              ) : step === 1 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      인플루언서
                    </span>
                    <h2 className="text-lg font-semibold">2/3 기본 정보</h2>
                    <Link
                      href="/auth/welcome"
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                    >
                      유형 변경
                    </Link>
                  </div>

                  <h3 className="text-base font-medium mb-1">기본 정보 입력</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    프로필에 표시될 기본 정보를 입력해주세요
                  </p>

                  <form onSubmit={handleNextToSocial} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobilePhone">휴대폰번호 (선택)</Label>
                      <Input
                        id="mobilePhone"
                        type="tel"
                        placeholder="010-1234-5678"
                        {...basicForm.register("mobilePhone")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landlinePhone">전화번호 (선택)</Label>
                      <Input
                        id="landlinePhone"
                        type="tel"
                        placeholder="02-1234-5678"
                        {...basicForm.register("landlinePhone")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userEmail}
                        readOnly
                        className="bg-muted/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">이름 (실명) *</Label>
                      <Input
                        id="fullName"
                        placeholder="실명을 입력하세요"
                        {...basicForm.register("fullName")}
                      />
                      {basicForm.formState.errors.fullName && (
                        <p className="text-sm text-destructive">
                          {basicForm.formState.errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nickname">활동명 (닉네임) *</Label>
                      <Input
                        id="nickname"
                        placeholder="활동명을 입력하세요"
                        {...basicForm.register("nickname")}
                      />
                      {basicForm.formState.errors.nickname && (
                        <p className="text-sm text-destructive">
                          {basicForm.formState.errors.nickname.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">한 줄 소개 (선택)</Label>
                      <Textarea
                        id="bio"
                        placeholder="나를 소개하는 한 줄을 작성해주세요"
                        rows={2}
                        maxLength={80}
                        {...basicForm.register("bio")}
                      />
                      <p className="text-xs text-muted-foreground text-right">
                        {(basicForm.watch("bio")?.length ?? 0)}/80
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthDate">생년월일 *</Label>
                      <Input
                        id="birthDate"
                        placeholder="생년월일 6자리를 입력해주세요 (예: 950315)"
                        maxLength={6}
                        {...basicForm.register("birthDate")}
                      />
                      {basicForm.formState.errors.birthDate && (
                        <p className="text-sm text-destructive">
                          {basicForm.formState.errors.birthDate.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>성별 *</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        {...basicForm.register("gender")}
                      >
                        <option value="" disabled>
                          선택해주세요
                        </option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">선택안함</option>
                      </select>
                      {basicForm.formState.errors.gender && (
                        <p className="text-sm text-destructive">
                          {basicForm.formState.errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>활동 카테고리 * (최대 3개)</Label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                              selectedCategories.includes(cat)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                      {basicForm.formState.errors.categories && (
                        <p className="text-sm text-destructive">
                          {basicForm.formState.errors.categories.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">소속회사 (선택)</Label>
                      <Input
                        id="company"
                        placeholder="소속 회사명"
                        {...basicForm.register("company")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralCode">추천인코드 (선택)</Label>
                      <Input
                        id="referralCode"
                        placeholder="추천인 코드 입력"
                        {...basicForm.register("referralCode")}
                      />
                    </div>

                    {serverError && (
                      <p className="text-sm text-destructive">{serverError}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(0)}
                      >
                        ← 이전
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        disabled={basicForm.formState.isSubmitting}
                      >
                        {basicForm.formState.isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "다음: 소셜 채널 등록 →"
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      인플루언서
                    </span>
                    <h2 className="text-lg font-semibold">3/3 소셜 채널</h2>
                    <Link
                      href="/auth/welcome"
                      className="ml-auto text-sm text-muted-foreground hover:text-foreground"
                    >
                      유형 변경
                    </Link>
                  </div>

                  <h3 className="text-base font-medium mb-1">소셜 채널 등록</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    활동중인 소셜 채널을 등록해주세요. 최소 1개 이상 필요합니다.
                  </p>

                  <form onSubmit={handleComplete} className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="border border-border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            채널 {index + 1}
                          </span>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-destructive h-8 px-2"
                              onClick={() => remove(index)}
                            >
                              삭제
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>플랫폼</Label>
                          <div className="flex flex-wrap gap-2">
                            {(platformExpandedByChannel[index]
                              ? [...defaultPlatforms, ...restPlatforms]
                              : [...defaultPlatforms, ...(restPlatforms.length > 0 ? [{ code: "_other", label: "Other" }] : [])]
                            ).map((p) => (
                              <button
                                key={p.code}
                                type="button"
                                onClick={() => {
                                  if (p.code === "_other") {
                                    setPlatformExpandedByChannel((prev) => ({ ...prev, [index]: true }))
                                  } else {
                                    snsForm.setValue(`snsChannels.${index}.platform`, p.code, { shouldValidate: true })
                                  }
                                }}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                                  snsForm.watch(`snsChannels.${index}.platform`) === p.code
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
                                }`}
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>채널 URL</Label>
                          <Input
                            placeholder="https://..."
                            {...snsForm.register(
                              `snsChannels.${index}.channelUrl`
                            )}
                          />
                          {snsForm.formState.errors.snsChannels?.[index]
                            ?.channelUrl && (
                            <p className="text-xs text-destructive">
                              {
                                snsForm.formState.errors.snsChannels[index]
                                  ?.channelUrl?.message
                              }
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>팔로워 수 (선택)</Label>
                          <Input
                            type="number"
                            placeholder="선택사항"
                            {...snsForm.register(
                              `snsChannels.${index}.followerCount`
                            )}
                          />
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        append({
                          platform: defaultPlatformCode,
                          channelUrl: "",
                          followerCount: "",
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      소셜 채널 추가
                    </Button>
                    {(snsForm.formState.errors.snsChannels?.root || (validChannels.length === 0 && snsFormValues && snsFormValues.length > 0)) && (
                      <p className="text-sm text-amber-500 flex items-center gap-2">
                        <span aria-hidden>⚠</span>
                        최소 1개의 채널 URL을 입력해주세요
                      </p>
                    )}

                    {serverError && (
                      <p className="text-sm text-destructive">{serverError}</p>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                      >
                        ← 이전
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        disabled={snsForm.formState.isSubmitting || validChannels.length < 1}
                      >
                        {snsForm.formState.isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "가입 완료"
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarStep({
  title,
  status,
  description,
}: {
  title: string
  status: "complete" | "active" | "pending"
  description: string
}) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
        status === "complete"
          ? "bg-accent/10 border-accent/30"
          : status === "active"
            ? "bg-primary/10 border-primary/30"
            : "border-border"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          status === "complete"
            ? "bg-accent text-accent-foreground"
            : status === "active"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
        }`}
      >
        {status === "complete" ? (
          <Check className="w-4 h-4" />
        ) : (
          <Minus className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium ${
            status === "pending" ? "text-muted-foreground" : ""
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {description}
        </p>
      </div>
    </div>
  )
}
