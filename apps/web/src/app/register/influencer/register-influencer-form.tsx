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
  verifyInviteCode,
  type BasicInfoInput,
  type SocialPlatformOption,
} from "./actions"
import { Button, Input, Label, Textarea, Switch, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@bling/ui"
import { Sparkles, Plus, X, Loader2, Check, Minus, Mail, ChevronLeft, Info } from "lucide-react"
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

// 플랫폼별 URL 검증 규칙 — 나중에 플랫폼별 구체적 URL 패턴으로 확장 가능
const PLATFORM_URL_RULES: Record<string, { prefix: string; message: string }> = {
  default: { prefix: "https://", message: "채널URL정보를 올바르게 입력해주세요" },
  // youtube: { prefix: "https://youtube.com/", message: "유튜브 채널 URL을 올바르게 입력해주세요" },
  // instagram: { prefix: "https://instagram.com/", message: "인스타그램 프로필 URL을 올바르게 입력해주세요" },
  // tiktok: { prefix: "https://tiktok.com/", message: "틱톡 프로필 URL을 올바르게 입력해주세요" },
}

function getUrlRuleForPlatform(platform: string) {
  return PLATFORM_URL_RULES[platform] ?? PLATFORM_URL_RULES.default
}

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
        channelUrl: z.string().min(1, "채널 URL을 입력해주세요"),
        isProfileVisible: z.boolean(),
      })
    )
    .min(1, "SNS 채널을 최소 1개 등록해주세요"),
})

type BasicInfoFormData = z.infer<typeof basicInfoSchema>
type SnsChannelsFormData = z.infer<typeof snsChannelsSchema>

interface RegisterInfluencerFormProps {
  userEmail: string
  initialStep: 0 | 1 | 2 | 3
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
  const [step, setStep] = useState<0 | 1 | 2 | 3>(initialStep)
  const [serverError, setServerError] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState("")
  const [inviteCodeError, setInviteCodeError] = useState<string | null>(null)
  const [inviteCodeSuccess, setInviteCodeSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    draftBasicInfo?.categories ?? []
  )
  const [platformExpandedByChannel, setPlatformExpandedByChannel] = useState<Record<number, boolean>>({})
  const [channelUrlErrorIndex, setChannelUrlErrorIndex] = useState<number | null>(null)
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
      snsChannels: [{ platform: defaultPlatformCode, channelUrl: "", isProfileVisible: true }],
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
    (ch: { platform: string; channelUrl: string }) => ch.platform && ch.channelUrl?.startsWith("https://")
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
    setChannelUrlErrorIndex(null)

    // 플랫폼별 URL prefix 검증 — 첫 번째 오류만 표시
    for (let i = 0; i < data.snsChannels.length; i++) {
      const ch = data.snsChannels[i]
      if (!ch.channelUrl) continue
      const rule = getUrlRuleForPlatform(ch.platform)
      if (!ch.channelUrl.startsWith(rule.prefix)) {
        setChannelUrlErrorIndex(i)
        return
      }
    }

    const { error } = await completeInfluencerRegistration(data.snsChannels)
    if (error) {
      setServerError(error)
      return
    }
    setStep(3)
  })

  const handleVerifyInviteCode = async () => {
    setInviteCodeError(null)
    setIsVerifying(true)
    const { error } = await verifyInviteCode(inviteCode)
    setIsVerifying(false)
    if (error) {
      setInviteCodeError(error)
      return
    }
    setInviteCodeSuccess(true)
    setTimeout(() => {
      router.push("/")
      router.refresh()
    }, 2000)
  }

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
              status={step > 2 ? "complete" : isSocialComplete ? "complete" : step === 2 ? "active" : "pending"}
              description={step > 2 || isSocialComplete ? "입력 완료" : "최소 1개 필요"}
            />
            <SidebarStep
              title="입력정보확인&완료"
              status={step === 3 ? "active" : "pending"}
              description={step === 3 ? "제출 완료" : "정보 확인 및 제출"}
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
                    <h2 className="text-lg font-semibold">1/4 안내사항</h2>
                  </div>
                  <div
                    className="prose prose-sm dark:prose-invert max-wnone text-foreground [&_ul]:my-2 [&_p]:my-2 [&_h3]:mt-4 [&_h3]:mb-2"
                    dangerouslySetInnerHTML={{
                      __html: guideHtml ?? "<p>안내 내용이 없습니다. 확인을 눌러 진행해주세요.</p>",
                    }}
                  />
                  <div className="pt-6">
                    <Button
                      type="button"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
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
                    <h2 className="text-lg font-semibold">2/4 기본 정보</h2>
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
              ) : step === 2 ? (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      인플루언서
                    </span>
                    <h2 className="text-lg font-semibold">3/4 소셜 채널</h2>
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
                            onChange={(e) => {
                              snsForm.register(`snsChannels.${index}.channelUrl`).onChange(e)
                              if (channelUrlErrorIndex === index) setChannelUrlErrorIndex(null)
                            }}
                          />
                          {channelUrlErrorIndex === index && (
                            <p className="text-xs text-destructive">
                              {getUrlRuleForPlatform(snsForm.watch(`snsChannels.${index}.platform`)).message}
                            </p>
                          )}
                          {snsForm.formState.errors.snsChannels?.[index]
                            ?.channelUrl && channelUrlErrorIndex !== index && (
                            <p className="text-xs text-destructive">
                              {
                                snsForm.formState.errors.snsChannels[index]
                                  ?.channelUrl?.message
                              }
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Switch
                            id={`profile-visible-${index}`}
                            checked={snsForm.watch(`snsChannels.${index}.isProfileVisible`)}
                            onCheckedChange={(checked) =>
                              snsForm.setValue(`snsChannels.${index}.isProfileVisible`, !!checked)
                            }
                          />
                          <Label htmlFor={`profile-visible-${index}`} className="text-sm cursor-pointer">
                            프로필 노출
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                                  <Info className="w-3.5 h-3.5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" sideOffset={4}>
                                <p>SNS 채널 정보를 인플루언서 프로필페이지에 노출시킵니다.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                          isProfileVisible: true,
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
                          "제출하기 →"
                        )}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                /* ── Step 3: 입력정보확인 & 완료 ── */
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                      인플루언서
                    </span>
                    <h2 className="text-lg font-semibold">4/4 입력정보확인 & 완료</h2>
                  </div>

                  {/* ── 섹션 1: 등록 완료 안내 + 승인코드 ── */}
                  <div className="space-y-6">
                    <div className="text-center space-y-3 py-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">등록이 완료되었습니다</h3>
                      <p className="text-base text-foreground">지원해주셔서 감사합니다</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        입력하신 정보 확인 후 빠른 시일 내에<br />
                        승인 결과를 전달드리도록 하겠습니다.
                      </p>
                    </div>

                    {/* 문의 안내 */}
                    <div className="bg-muted/50 rounded-lg p-4 text-center space-y-1">
                      <p className="text-sm text-muted-foreground">
                        궁금한 사항이 있으시면 아래 이메일로 문의해주세요.
                      </p>
                      <a
                        href="mailto:balance.bling@gmail.com"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        balance.bling@gmail.com
                      </a>
                    </div>

                    {/* 승인코드 입력 */}
                    <div className="border border-border rounded-lg p-4 space-y-3">
                      <p className="text-sm font-medium">
                        승인코드를 전달받으셨나요?
                      </p>
                      {inviteCodeSuccess ? (
                        <div className="flex items-center gap-2 text-sm text-primary font-medium">
                          <Check className="w-4 h-4" />
                          승인이 완료되었습니다! 잠시 후 이동합니다...
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="승인코드 입력"
                            value={inviteCode}
                            onChange={(e) => {
                              setInviteCode(e.target.value)
                              setInviteCodeError(null)
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleVerifyInviteCode}
                            disabled={isVerifying || !inviteCode.trim()}
                          >
                            {isVerifying ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "확인"
                            )}
                          </Button>
                        </div>
                      )}
                      {inviteCodeError && (
                        <p className="text-sm text-destructive">{inviteCodeError}</p>
                      )}
                    </div>
                  </div>

                  {/* ── 구분선 ── */}
                  <div className="border-t border-border my-8" />

                  {/* ── 섹션 2: 등록 정보 확인 ── */}
                  <div className="space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                      <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        아래 등록정보를 확인하시고 수정이 필요하면 이전 단계로 이동해 수정 후 다시 제출하시면 수정된 정보로 신청이 완료됩니다.
                      </p>
                    </div>

                    {/* 기본 정보 요약 */}
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold border-b border-border pb-2">기본 정보</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <InfoRow label="이메일" value={userEmail} />
                        <InfoRow label="이름" value={basicForm.getValues("fullName")} />
                        <InfoRow label="활동명" value={basicForm.getValues("nickname")} />
                        <InfoRow label="생년월일" value={basicForm.getValues("birthDate")} />
                        <InfoRow
                          label="성별"
                          value={
                            basicForm.getValues("gender") === "male" ? "남성"
                            : basicForm.getValues("gender") === "female" ? "여성"
                            : "선택안함"
                          }
                        />
                        {basicForm.getValues("mobilePhone") && (
                          <InfoRow label="휴대폰" value={basicForm.getValues("mobilePhone")!} />
                        )}
                        {basicForm.getValues("landlinePhone") && (
                          <InfoRow label="전화번호" value={basicForm.getValues("landlinePhone")!} />
                        )}
                        {basicForm.getValues("bio") && (
                          <InfoRow label="한 줄 소개" value={basicForm.getValues("bio")!} fullWidth />
                        )}
                        {basicForm.getValues("company") && (
                          <InfoRow label="소속회사" value={basicForm.getValues("company")!} />
                        )}
                        {basicForm.getValues("referralCode") && (
                          <InfoRow label="추천인코드" value={basicForm.getValues("referralCode")!} />
                        )}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">카테고리:</span>{" "}
                        <span className="inline-flex flex-wrap gap-1.5 ml-1">
                          {selectedCategories.map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                            >
                              {cat}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>

                    {/* 소셜 채널 요약 */}
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold border-b border-border pb-2">소셜 채널</h4>
                      <div className="space-y-2">
                        {snsForm.getValues("snsChannels")
                          .filter((ch) => ch.platform && ch.channelUrl)
                          .map((ch, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm border border-border rounded-lg p-3">
                              <span className="font-medium capitalize min-w-[80px]">{ch.platform}</span>
                              <a
                                href={ch.channelUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                              >
                                {ch.channelUrl}
                              </a>
                              <span className={`ml-auto text-xs shrink-0 px-2 py-0.5 rounded-full ${
                                ch.isProfileVisible
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {ch.isProfileVisible ? "노출" : "비공개"}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* 이전 단계로 / 홈으로 */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        이전 단계로 수정
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          router.push("/")
                          router.refresh()
                        }}
                      >
                        홈으로 이동
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <span className="text-muted-foreground">{label}</span>
      <p className="font-medium mt-0.5">{value}</p>
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
