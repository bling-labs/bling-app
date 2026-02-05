"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button, Input, Label, Checkbox } from "@bling/ui"
import { Loader2 } from "lucide-react"

const signupSchema = z
  .object({
    email: z.email("올바른 이메일 형식을 입력해주세요"),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "비밀번호는 영문과 숫자를 포함해야 합니다"
      ),
    confirmPassword: z.string(),
    agreeTerms: z.literal(true, {
      error: "이용약관에 동의해주세요",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      agreeTerms: false as unknown as true,
    },
  })

  const agreeTerms = watch("agreeTerms")

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setServerError(error.message)
      return
    }

    router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="영문 + 숫자 8자 이상"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start gap-2 pt-2">
        <Checkbox
          id="agreeTerms"
          checked={agreeTerms}
          onCheckedChange={(checked) =>
            setValue("agreeTerms", checked === true ? true : (false as unknown as true), {
              shouldValidate: true,
            })
          }
        />
        <Label htmlFor="agreeTerms" className="text-sm leading-snug cursor-pointer">
          <span className="text-muted-foreground">
            <button type="button" className="text-primary underline hover:text-primary/80">
              이용약관
            </button>
            {" 및 "}
            <button type="button" className="text-primary underline hover:text-primary/80">
              개인정보처리방침
            </button>
            에 동의합니다
          </span>
        </Label>
      </div>
      {errors.agreeTerms && (
        <p className="text-sm text-destructive">{errors.agreeTerms.message}</p>
      )}

      {serverError && (
        <p className="text-sm text-destructive text-center">{serverError}</p>
      )}

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "회원가입"
        )}
      </Button>
    </form>
  )
}
