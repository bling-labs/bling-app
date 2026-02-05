"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClient } from "@/lib/supabase/client"
import { Button, Input, Label } from "@bling/ui"
import { Loader2 } from "lucide-react"

const resetSchema = z.object({
  email: z.email("올바른 이메일 형식을 입력해주세요"),
})

type ResetFormData = z.infer<typeof resetSchema>

export function ResetPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    setServerError(null)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    })

    if (error) {
      setServerError(error.message)
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground text-sm">
          비밀번호 재설정 링크를 이메일로 보냈습니다.
          <br />
          메일을 확인해주세요.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="가입한 이메일을 입력해주세요"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
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
          "재설정 링크 보내기"
        )}
      </Button>
    </form>
  )
}
