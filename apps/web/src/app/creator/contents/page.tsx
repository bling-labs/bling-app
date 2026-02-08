import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@bling/database"
import { getMyContents } from "./actions"
import { Button } from "@bling/ui"
import { Plus } from "lucide-react"
import { ContentsListClient } from "./contents-list-client"

export default async function MypageContentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    return null
  }

  const contents = await getMyContents(user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">콘텐츠</h1>
          <p className="mt-1 text-muted-foreground">
            광고주에게 보여줄 콘텐츠를 등록하고 관리하세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/creator/contents/new">
            <Plus className="w-4 h-4 mr-2" />
            콘텐츠 등록
          </Link>
        </Button>
      </div>

      <ContentsListClient initialContents={contents} />
    </div>
  )
}
