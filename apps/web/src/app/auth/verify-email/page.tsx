"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Sparkles, Mail, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@bling/ui"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    const supabase = createClient()
    await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setResending(false)
    setResent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold">이메일을 확인해주세요</h1>
            <p className="text-muted-foreground text-sm">
              {email ? (
                <>
                  <span className="font-medium text-foreground">{email}</span>
                  으로 확인 메일을 보냈습니다.
                </>
              ) : (
                "입력하신 이메일로 확인 메일을 보냈습니다."
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              메일의 링크를 클릭하면 가입이 완료됩니다.
            </p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resending || resent}
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : resent ? (
              "메일을 재발송했습니다"
            ) : (
              "확인 메일 재발송"
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            로그인으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
