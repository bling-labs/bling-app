import Link from "next/link"
import { Sparkles } from "lucide-react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
          <h1 className="text-2xl font-bold">비밀번호 재설정</h1>
          <p className="text-muted-foreground">
            가입한 이메일을 입력하시면 재설정 링크를 보내드립니다
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <ResetPasswordForm />
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
