import Link from "next/link"
import { Sparkles } from "lucide-react"
import { UpdatePasswordForm } from "@/components/auth/update-password-form"

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
          <h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
          <p className="text-muted-foreground">
            새로운 비밀번호를 입력해주세요
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <UpdatePasswordForm />
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
