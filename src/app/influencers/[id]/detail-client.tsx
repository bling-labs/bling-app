"use client"

import { useState, useRef, useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, LayoutGrid, List, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { InfluencerDetailData, BlingContentItem } from "@/data/influencer-detail"

type ViewMode = "grid" | "list"

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", cb)
      return () => mq.removeEventListener("change", cb)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

function formatPrice(price: number | "협의"): string {
  if (price === "협의") return "금액 협의"
  if (price >= 10000) return `₩${Math.round(price / 10000)}만`
  if (price >= 1000) return `₩${(price / 1000).toFixed(1)}K`
  return `₩${price.toLocaleString()}`
}

function ContentListItem({ item }: { item: BlingContentItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isFixedPrice = item.licensePrice !== "협의"

  return (
    <div
      id={`content-${item.id}`}
      className="min-h-[85vh] flex flex-col md:flex-row gap-6 md:gap-8 scroll-mt-24"
    >
      {/* 좌측: 콘텐츠 (영상/이미지) */}
      <div className="flex-1 min-h-[40vh] md:min-h-0 flex items-center justify-center">
        <div className="relative w-full max-w-md aspect-[9/16] rounded-2xl overflow-hidden bg-muted">
          {item.type === "video" && item.videoUrl ? (
            <>
              <video
                ref={videoRef}
                src={item.videoUrl}
                poster={item.thumbnailUrl}
                playsInline
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover"
                onMouseEnter={() => videoRef.current?.play()}
                onMouseLeave={() => {
                  videoRef.current?.pause()
                  if (videoRef.current) videoRef.current.currentTime = 0
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            </>
          ) : (
            <Image
              src={item.thumbnailUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          )}
        </div>
      </div>

      {/* 우측: 설명 영역 */}
      <div className="md:w-96 shrink-0 flex flex-col gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
          {item.description && (
            <p className="text-muted-foreground mt-2 leading-relaxed">{item.description}</p>
          )}
        </div>

        <div className="py-4 border-y border-border">
          <p className="text-sm text-muted-foreground mb-1">라이센스 가격</p>
          <p className="text-lg font-bold text-foreground">{formatPrice(item.licensePrice)}</p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button asChild size="lg" className="w-full">
            <Link href={`/contents/${item.id}`}>
              {isFixedPrice ? "구매하기" : "의뢰하기"}
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href={`/contents/${item.id}?tab=question`}>
              <MessageCircle className="w-4 h-4" />
              질문하기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function InfluencerDetailClient({ detail }: { detail: InfluencerDetailData }) {
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const contents = detail.blingContents

  if (contents.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-bold text-foreground mb-4">블링 등록 콘텐츠</h2>
        <p className="text-muted-foreground py-8 text-center">등록된 콘텐츠가 없습니다.</p>
      </section>
    )
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">블링 등록 콘텐츠</h2>
        {isDesktop && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="리스트 보기"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label="그리드 보기"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {viewMode === "grid" && isDesktop ? (
        <div className="grid grid-cols-3 gap-4">
          {contents.map((item) => (
            <Link
              key={item.id}
              href={`/contents/${item.id}`}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-muted"
            >
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 33vw, 200px"
                className="object-cover transition-transform group-hover:scale-105"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* 리스트 뷰: 1개씩 보이고 스크롤로 다음 콘텐츠 */
        <div
          className="overflow-y-auto rounded-2xl border border-border bg-card"
          style={{ maxHeight: "calc(100vh - 12rem)" }}
        >
          <div className="p-6 space-y-16 md:space-y-24 snap-y snap-mandatory">
            {contents.map((item) => (
              <div key={item.id} className="snap-start snap-always">
                <ContentListItem item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

