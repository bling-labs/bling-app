import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@bling/ui"
import { CheckCircle2, Video, Users } from "lucide-react"

export default function AdvertiserCompletePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              광고주 등록이 완료되었습니다
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Bling과 함께하는 마케팅을 시작할 준비가 되었어요.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Video className="w-4 h-4" />
                콘텐츠 둘러보기
              </Button>
            </Link>
            <Link href="/explore/influencers">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
              >
                <Users className="w-4 h-4" />
                인플루언서 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
