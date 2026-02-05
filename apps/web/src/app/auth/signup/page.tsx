import Link from "next/link"
import { Sparkles } from "lucide-react"
import { SignupForm } from "@/components/auth/signup-form"
import { GoogleButton } from "@/components/auth/google-button"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold">Bling</span>
          </Link>
          <h1 className="text-2xl font-bold">회원가입</h1>
          <p className="text-muted-foreground">
            Bling에 가입하고 새로운 기회를 만나보세요
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <SignupForm />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <GoogleButton />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:text-primary/80 font-medium"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
