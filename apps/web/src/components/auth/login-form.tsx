"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button, Input, Label } from "@bling/ui"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  email: z.email("올바른 이메일 형식을 입력해주세요"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      if (error.message === "Invalid login credentials") {
        setServerError("이메일 또는 비밀번호가 올바르지 않습니다")
      } else if (error.message === "Email not confirmed") {
        setServerError("이메일 인증이 완료되지 않았습니다. 메일을 확인해주세요")
      } else {
        setServerError(error.message)
      }
      return
    }

    router.push("/")
    router.refresh()
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">비밀번호</Label>
          <a
            href="/auth/reset-password"
            className="text-xs text-primary hover:text-primary/80"
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

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
          "로그인"
        )}
      </Button>
    </form>
  )
}
