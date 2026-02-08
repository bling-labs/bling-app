import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getSocialPlatforms } from "@/app/register/influencer/actions"
import { ContentRegisterForm } from "../content-register-form"
import { Button } from "@bling/ui"
import { ArrowLeft } from "lucide-react"

export default async function MypageContentsNewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return null
  }

  const socialPlatforms = await getSocialPlatforms()
  const platformOptions = [
    ...socialPlatforms.defaultVisible,
    ...socialPlatforms.rest,
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/creator/contents">
            <ArrowLeft className="w-4 h-4 mr-1" />
            목록
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">콘텐츠 등록</h1>
        <p className="mt-1 text-muted-foreground">
          영상 또는 이미지 콘텐츠를 등록하세요. 썸네일과 제목은 필수입니다.
        </p>
      </div>
      <ContentRegisterForm platformOptions={platformOptions} />
    </div>
  )
}
