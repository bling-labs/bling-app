"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { registerAdvertiser } from "./actions"
import { Button, Input, Label, Textarea } from "@bling/ui"
import { Sparkles, Upload, X, Loader2 } from "lucide-react"
import { SignupProgress } from "@/components/auth/signup-progress"

const BUSINESS_CATEGORIES = [
  "뷰티/화장품",
  "패션/의류",
  "식품/음료",
  "여행/숙박",
  "IT/전자기기",
  "생활용품",
  "교육",
  "건강/의료",
  "금융",
  "엔터테인먼트",
] as const

const advertiserSchema = z.object({
  companyName: z.string().min(1, "회사명을 입력해주세요"),
  contactName: z.string().min(1, "담당자 이름을 입력해주세요"),
  contactPhone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, "올바른 전화번호 형식을 입력해주세요"),
  jobTitle: z.string().optional(),
  businessCategory: z.string().min(1, "업종을 선택해주세요"),
  companyUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("http://") || val.startsWith("https://"),
      "URL은 http:// 또는 https://로 시작해야 합니다"
    ),
  companyDescription: z.string().optional(),
})

type AdvertiserFormData = z.infer<typeof advertiserSchema>

export default function RegisterAdvertiserPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdvertiserFormData>({
    resolver: zodResolver(advertiserSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setServerError("파일 크기는 10MB 이하여야 합니다")
        return
      }
      setLicenseFile(file)
      setServerError(null)
    }
  }

  const onSubmit = async (data: AdvertiserFormData) => {
    setServerError(null)

    let businessLicenseUrl: string | null = null

    // 사업자등록증 업로드 (Storage는 클라이언트에서 유지)
    if (licenseFile) {
      setUploading(true)
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setUploading(false)
        setServerError("로그인이 필요합니다")
        return
      }

      const fileExt = licenseFile.name.split(".").pop()
      const filePath = `business-licenses/${user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, licenseFile, { upsert: true })

      setUploading(false)

      if (uploadError) {
        setServerError(`파일 업로드 실패: ${uploadError.message}`)
        return
      }

      businessLicenseUrl = filePath
    }

    // 프로필 업데이트 (Server Action)
    const { error } = await registerAdvertiser({
      ...data,
      businessLicenseUrl,
    })

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
        </div>

        {/* 프로그레스 UI */}
        <SignupProgress currentStep={2} userType="advertiser" />

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">광고주 등록</h1>
          <p className="text-muted-foreground">
            광고주 활동에 필요한 정보를 입력해주세요
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-xl p-6 space-y-6"
        >
          {/* 회사 정보 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">회사 정보</h2>

            <div className="space-y-2">
              <Label htmlFor="companyName">회사명/브랜드명 *</Label>
              <Input
                id="companyName"
                placeholder="회사명 또는 브랜드명"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessCategory">업종 카테고리 *</Label>
              <select
                id="businessCategory"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register("businessCategory")}
                defaultValue=""
              >
                <option value="" disabled>
                  업종을 선택해주세요
                </option>
                {BUSINESS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.businessCategory && (
                <p className="text-sm text-destructive">
                  {errors.businessCategory.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyUrl">회사 홈페이지 (선택)</Label>
              <Input
                id="companyUrl"
                placeholder="https://example.com"
                {...register("companyUrl")}
              />
              {errors.companyUrl && (
                <p className="text-sm text-destructive">
                  {errors.companyUrl.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDescription">회사 소개 (선택)</Label>
              <Textarea
                id="companyDescription"
                placeholder="회사 또는 브랜드를 간단히 소개해주세요"
                rows={3}
                {...register("companyDescription")}
              />
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">담당자 정보</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">담당자 이름 *</Label>
                <Input
                  id="contactName"
                  placeholder="홍길동"
                  {...register("contactName")}
                />
                {errors.contactName && (
                  <p className="text-sm text-destructive">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">담당자 연락처 *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="010-1234-5678"
                  {...register("contactPhone")}
                />
                {errors.contactPhone && (
                  <p className="text-sm text-destructive">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">직책 (선택)</Label>
              <Input
                id="jobTitle"
                placeholder="마케팅 매니저"
                {...register("jobTitle")}
              />
            </div>
          </div>

          {/* 사업자등록증 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">사업자등록증 (선택)</h2>
            <p className="text-sm text-muted-foreground">
              사업자등록증을 첨부하시면 빠른 인증이 가능합니다 (최대 10MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            {licenseFile ? (
              <div className="flex items-center justify-between border border-border rounded-lg p-3">
                <span className="text-sm truncate">{licenseFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setLicenseFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  className="text-muted-foreground hover:text-destructive ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  클릭하여 파일을 선택하세요
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, JPG, PNG (최대 10MB)
                </p>
              </button>
            )}
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
              disabled={isSubmitting || uploading}
            >
              {isSubmitting || uploading ? (
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
