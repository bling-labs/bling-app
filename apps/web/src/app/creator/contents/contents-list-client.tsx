"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@bling/ui"
import { Image as ImageIcon, Video, Trash2, Loader2 } from "lucide-react"
import { deleteContent } from "./actions"
import { toast } from "sonner"

type ContentItem = {
  id: string
  type: "video" | "image"
  title: string
  description: string | null
  thumbnailUrl: string
  videoUrl: string | null
  platform: string
  status: string
  createdAt: Date
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: "유튜브",
  instagram: "인스타그램",
  tiktok: "틱톡",
  blog: "블로그",
  x: "X",
}

export function ContentsListClient({ initialContents }: { initialContents: ContentItem[] }) {
  const router = useRouter()
  const [contents, setContents] = useState(initialContents)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("이 콘텐츠를 삭제할까요?")) return
    setDeletingId(id)
    const { error } = await deleteContent(id)
    setDeletingId(null)
    if (error) {
      toast.error(error)
      return
    }
    setContents((prev) => prev.filter((c) => c.id !== id))
    toast.success("삭제되었습니다")
    router.refresh()
  }

  if (contents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
        <p className="text-muted-foreground">등록된 콘텐츠가 없습니다.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          콘텐츠 등록 버튼으로 첫 콘텐츠를 추가해보세요.
        </p>
      </div>
    )
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <li
          key={content.id}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="aspect-video relative bg-muted">
            {content.thumbnailUrl ? (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                {content.type === "video" ? (
                  <Video className="h-12 w-12 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
            )}
            <span
              className={`absolute top-2 right-2 rounded px-2 py-0.5 text-xs font-medium ${
                content.status === "visible"
                  ? "bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {content.status === "visible" ? "노출" : "비공개"}
            </span>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-1">{content.title}</h3>
            <p className="text-xs text-muted-foreground">
              {PLATFORM_LABEL[content.platform] ?? content.platform}
            </p>
            {content.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{content.description}</p>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => handleDelete(content.id)}
              disabled={deletingId === content.id}
            >
              {deletingId === content.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-1" />
                  삭제
                </>
              )}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
