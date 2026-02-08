"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { updateMypageProfile } from "./actions"
import type { BasicInfoInput, SnsChannelInput } from "@/app/register/influencer/actions"
import { Button, Input, Label, Textarea, Switch, Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@bling/ui"
import { Loader2, Plus, Upload, User, Info } from "lucide-react"
import { toast } from "sonner"
import type { MypageProfileData } from "./actions"

const CATEGORIES = [
  "뷰티", "패션", "맛집/음식", "여행", "라이프스타일", "IT/테크", "게임", "스포츠", "교육", "육아", "반려동물", "엔터테인먼트",
] as const

const PLATFORM_URL_RULES: Record<string, { prefix: string; message: string }> = {
  default: { prefix: "https://", message: "채널 URL을 올바르게 입력해주세요" },
}

function getUrlRuleForPlatform(platform: string) {
  return PLATFORM_URL_RULES[platform] ?? PLATFORM_URL_RULES.default
}

function formatBirthDateToYYMMDD(date: Date): string {
  const y = date.getFullYear() % 100
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
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
    .pipe(z.string().length(6, "생년월일 6자리를 입력해주세요").regex(/^\d{6}$/)),
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

interface SocialPlatformOption {
  code: string
  label: string
}

interface ProfileEditFormProps {
  profile: MypageProfileData
  socialPlatforms: { defaultVisible: SocialPlatformOption[]; rest: SocialPlatformOption[] }
}

export function ProfileEditForm({ profile, socialPlatforms }: ProfileEditFormProps) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatarUrl)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const defaultPlatforms = socialPlatforms.defaultVisible.length > 0
    ? socialPlatforms.defaultVisible
    : [{ code: "youtube", label: "유튜브" }, { code: "instagram", label: "인스타그램" }, { code: "tiktok", label: "틱톡" }]
  const restPlatforms = socialPlatforms.rest ?? []
  const defaultPlatformCode = defaultPlatforms[0]?.code ?? "youtube"

  const [selectedCategories, setSelectedCategories] = useState<string[]>(profile.categories)
  const [platformExpandedByChannel, setPlatformExpandedByChannel] = useState<Record<number, boolean>>({})
  const [channelUrlErrorIndex, setChannelUrlErrorIndex] = useState<number | null>(null)

  const basicForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      mobilePhone: profile.mobilePhone ?? "",
      landlinePhone: profile.landlinePhone ?? "",
      fullName: profile.fullName,
      nickname: profile.nickname,
      bio: profile.bio ?? "",
      birthDate: formatBirthDateToYYMMDD(profile.birthDate),
      categories: profile.categories,
      company: profile.company ?? "",
      referralCode: profile.referralCode ?? "",
      gender: profile.gender,
    },
  })

  const snsForm = useForm<SnsChannelsFormData>({
    resolver: zodResolver(snsChannelsSchema),
    defaultValues: {
      snsChannels:
        profile.snsChannels.length > 0
          ? profile.snsChannels
          : [{ platform: defaultPlatformCode, channelUrl: "", isProfileVisible: true }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control: snsForm.control, name: "snsChannels" })
  const snsFormValues = snsForm.watch("snsChannels")
  const validChannels = snsFormValues?.filter((ch) => ch.platform && ch.channelUrl?.startsWith("https://")) ?? []

  const toggleCategory = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : selectedCategories.length < 3
        ? [...selectedCategories, category]
        : selectedCategories
    setSelectedCategories(updated)
    basicForm.setValue("categories", updated, { shouldValidate: true })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) return
    setAvatarFile(file)
    const url = URL.createObjectURL(file)
    setAvatarPreview(url)
  }

  const handleSubmit = async () => {
    setServerError(null)
    setChannelUrlErrorIndex(null)

    const basicValid = await basicForm.trigger()
    if (!basicValid) return
    const snsValid = await snsForm.trigger()
    if (!snsValid) return

    const snsData = snsForm.getValues("snsChannels")
    for (let i = 0; i < snsData.length; i++) {
      const ch = snsData[i]
      if (!ch.channelUrl) continue
      const rule = getUrlRuleForPlatform(ch.platform)
      if (!ch.channelUrl.startsWith(rule.prefix)) {
        setChannelUrlErrorIndex(i)
        return
      }
    }

    let avatarUrl: string | null = profile.avatarUrl
    if (avatarFile) {
      setUploading(true)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setServerError("로그인이 필요합니다")
        setUploading(false)
        return
      }
      const ext = avatarFile.name.split(".").pop() || "jpg"
      const path = `avatars/${user.id}.${ext}`
      const { error: uploadError } = await supabase.storage.from("documents").upload(path, avatarFile, { upsert: true })
      setUploading(false)
      if (uploadError) {
        setServerError(`프로필 사진 업로드 실패: ${uploadError.message}`)
        return
      }
      const { data: urlData } = supabase.storage.from("documents").getPublicUrl(path)
      avatarUrl = urlData.publicUrl
    }

    const basicData = basicForm.getValues()
    const input: BasicInfoInput & { avatarUrl?: string | null } = {
      ...basicData,
      birthDate: String(basicData.birthDate).replace(/\D/g, "").slice(0, 6),
      gender: basicData.gender || "other",
      avatarUrl,
    }
    const { error } = await updateMypageProfile(input, snsData)
    if (error) {
      setServerError(error)
      return
    }
    toast.success("프로필이 저장되었습니다")
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">프로필 관리</h1>
        <p className="mt-1 text-muted-foreground">기본 정보와 SNS 채널을 수정할 수 있습니다.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* 아바타 */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="프로필" className="h-full w-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            프로필 사진을 선택하면 저장 시 함께 반영됩니다.
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">이름 (실명) *</Label>
            <Input id="fullName" placeholder="실명" {...basicForm.register("fullName")} />
            {basicForm.formState.errors.fullName && (
              <p className="text-sm text-destructive">{basicForm.formState.errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="nickname">활동명 *</Label>
            <Input id="nickname" placeholder="활동명" {...basicForm.register("nickname")} />
            {basicForm.formState.errors.nickname && (
              <p className="text-sm text-destructive">{basicForm.formState.errors.nickname.message}</p>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">휴대폰 (선택)</Label>
            <Input id="mobilePhone" type="tel" placeholder="010-1234-5678" {...basicForm.register("mobilePhone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="landlinePhone">전화번호 (선택)</Label>
            <Input id="landlinePhone" type="tel" placeholder="02-1234-5678" {...basicForm.register("landlinePhone")} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">한 줄 소개 (선택, 80자)</Label>
          <Textarea id="bio" rows={2} maxLength={80} placeholder="나를 소개하는 한 줄" {...basicForm.register("bio")} />
          <p className="text-xs text-muted-foreground text-right">{(basicForm.watch("bio")?.length ?? 0)}/80</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="birthDate">생년월일 * (6자리)</Label>
          <Input id="birthDate" placeholder="950315" maxLength={6} {...basicForm.register("birthDate")} />
          {basicForm.formState.errors.birthDate && (
            <p className="text-sm text-destructive">{basicForm.formState.errors.birthDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>성별 *</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...basicForm.register("gender")}
          >
            <option value="">선택</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">선택안함</option>
          </select>
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
            <p className="text-sm text-destructive">{basicForm.formState.errors.categories.message}</p>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">소속회사 (선택)</Label>
            <Input id="company" placeholder="소속 회사명" {...basicForm.register("company")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referralCode">추천인코드 (선택)</Label>
            <Input id="referralCode" placeholder="추천인 코드" {...basicForm.register("referralCode")} />
          </div>
        </div>

        {/* SNS 채널 */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-medium mb-2">SNS 채널</h3>
          <p className="text-sm text-muted-foreground mb-4">최소 1개 이상 등록해주세요.</p>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">채널 {index + 1}</span>
                  {fields.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                      삭제
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>플랫폼</Label>
                  <div className="flex flex-wrap gap-2">
                    {[...defaultPlatforms, ...restPlatforms].map((p) => {
                      const used = snsFormValues?.some((ch, i) => i !== index && ch.platform === p.code)
                      return (
                        <button
                          key={p.code}
                          type="button"
                          disabled={!!used}
                          onClick={() => snsForm.setValue(`snsChannels.${index}.platform`, p.code)}
                          className={`px-3 py-1.5 rounded-md text-sm border ${
                            snsForm.watch(`snsChannels.${index}.platform`) === p.code
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/50"
                          } ${used ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {p.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>채널 URL</Label>
                  <Input
                    placeholder="https://..."
                    {...snsForm.register(`snsChannels.${index}.channelUrl`)}
                    onChange={(e) => {
                      snsForm.register(`snsChannels.${index}.channelUrl`).onChange(e)
                      if (channelUrlErrorIndex === index) setChannelUrlErrorIndex(null)
                    }}
                  />
                  {channelUrlErrorIndex === index && (
                    <p className="text-xs text-destructive">{getUrlRuleForPlatform(snsForm.watch(`snsChannels.${index}.platform`)).message}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id={`visible-${index}`}
                    checked={snsForm.watch(`snsChannels.${index}.isProfileVisible`)}
                    onCheckedChange={(c) => snsForm.setValue(`snsChannels.${index}.isProfileVisible`, !!c)}
                  />
                  <Label htmlFor={`visible-${index}`} className="text-sm cursor-pointer">프로필 노출</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild><button type="button" className="text-muted-foreground"><Info className="w-3.5 h-3.5" /></button></TooltipTrigger>
                      <TooltipContent>프로필 페이지에 이 채널을 노출합니다.</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ platform: defaultPlatformCode, channelUrl: "", isProfileVisible: true })}
            >
              <Plus className="w-4 h-4 mr-2" /> 채널 추가
            </Button>
          </div>
        </div>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}

        <Button onClick={handleSubmit} disabled={basicForm.formState.isSubmitting || uploading || validChannels.length < 1}>
          {basicForm.formState.isSubmitting || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장하기"}
        </Button>
      </div>
    </div>
  )
}
