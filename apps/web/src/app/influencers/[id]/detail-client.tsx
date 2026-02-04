"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Grid3X3, List, Play, ExternalLink, Info } from "lucide-react"
import { Button } from "@bling/ui"
import { PLATFORM_ICONS } from "@/components/platform-icons"
import {
  LICENSING_LABELS,
  SECONDARY_CREATION_LABELS,
  type InfluencerDetailData,
  type BlingContentItem,
  type SecondaryContentItem,
} from "@/data/influencer-detail"
import { cn } from "@/lib/utils"

function formatPrice(price: number | "협의"): string {
  if (price === "협의") return "협의"
  return `₩${price.toLocaleString()}`
}

function formatViewCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${Math.round(count / 1000)}K`
  return String(count)
}

const SECONDARY_COLORS = {
  1: "text-red-500",
  2: "text-yellow-500",
  3: "text-green-500",
} as const

const SECONDARY_DOT = {
  1: "bg-red-500",
  2: "bg-yellow-500",
  3: "bg-green-500",
} as const

export function InfluencerDetailClient({ detail }: { detail: InfluencerDetailData }) {
  const [activeTab, setActiveTab] = useState<"intro" | "contents">("intro")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedContent, setSelectedContent] = useState<BlingContentItem | null>(
    () => detail.blingContents[0] ?? null
  )
  const [showLicensingInfo, setShowLicensingInfo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const tags = detail.category.split(/[·,]/).map((t) => t.trim()).filter(Boolean)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Back link */}
      <Link
        href="/influencers"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        인플루언서 목록
      </Link>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8">
        <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden">
          <Image
            src={detail.profileImageUrl}
            alt={detail.name}
            fill
            sizes="96px"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">{detail.name}</h1>
          <p className="text-primary">{detail.handle}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded-md bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          {detail.bio && (
            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{detail.bio}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            {detail.platformFollowers.map((pf) => {
              const Icon = PLATFORM_ICONS[pf.platform]
              const link = detail.socialLinks.find((s) => s.platform === pf.platform)
              return (
                <a
                  key={pf.platform}
                  href={link?.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
                  <span className="text-sm font-medium text-foreground">{pf.range}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )
            })}
          </div>
          <Button className="mt-4">
            협업 문의하기
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("intro")}
            className={cn(
              "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === "intro"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            소개
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contents")}
            className={cn(
              "pb-4 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === "contents"
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            콘텐츠 목록 ({detail.blingContents.length})
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "intro" ? (
        <IntroTab detail={detail} showLicensingInfo={showLicensingInfo} setShowLicensingInfo={setShowLicensingInfo} />
      ) : (
        <ContentsTab
          detail={detail}
          viewMode={viewMode}
          setViewMode={setViewMode}
          selectedContent={selectedContent}
          setSelectedContent={setSelectedContent}
          videoRef={videoRef}
        />
      )}
    </div>
  )
}

function IntroTab({
  detail,
  showLicensingInfo,
  setShowLicensingInfo,
}: {
  detail: InfluencerDetailData
  showLicensingInfo: boolean
  setShowLicensingInfo: (v: boolean) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
      {/* Left: 인플루언서 소개 (2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">인플루언서 소개</h2>
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {detail.bio ?? "소개가 없습니다."}
          </div>
        </div>
        {detail.collaborationNotes && (
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">협업 시 참고사항</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {detail.collaborationNotes.productionDays && (
                <li>• 콘텐츠 제작 기간: {detail.collaborationNotes.productionDays}</li>
              )}
              {detail.collaborationNotes.revisionCount && (
                <li>• 수정 횟수: {detail.collaborationNotes.revisionCount}</li>
              )}
              {detail.collaborationNotes.originalFileProvision && (
                <li>• 원본 파일 제공: {detail.collaborationNotes.originalFileProvision}</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Right: 2차저작, 라이센싱 규칙 (1 col) */}
      <div className="space-y-6">
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">2차 저작 허용범위</h2>
            <button
              type="button"
              onClick={() => setShowLicensingInfo(!showLicensingInfo)}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="설명 보기"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          {showLicensingInfo && (
            <div className="absolute top-full left-0 right-0 z-10 mt-2 p-4 rounded-lg bg-popover border border-border shadow-xl text-xs text-muted-foreground space-y-2">
              <p><strong>1. 허용 안 함:</strong> 영상 원본에 광고제품을 레이어하는 형태로만 편집 가능</p>
              <p><strong>2. 일부 허용:</strong> 컷편집 등 일부 허용</p>
              <p><strong>3. 자유 허용:</strong> 콘텐츠의 지나친 변질을 유발하지 않는 선에서 자유롭게 허용</p>
            </div>
          )}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn("w-3 h-3 rounded-full shrink-0", SECONDARY_DOT[detail.licensingImage])} />
              <span className="text-sm">이미지</span>
              <span className="text-sm font-medium">{LICENSING_LABELS.image[detail.licensingImage]}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("w-3 h-3 rounded-full shrink-0", SECONDARY_DOT[detail.licensingVideo])} />
              <span className="text-sm">영상</span>
              <span className="text-sm font-medium">{LICENSING_LABELS.video[detail.licensingVideo]}</span>
            </div>
          </div>
        </div>

        {detail.licensingRules && detail.licensingRules.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">라이센싱 규칙</h2>
            <ul className="space-y-2">
              {detail.licensingRules.map((rule, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  {rule.prohibited ? (
                    <span className="text-red-500 font-bold">×</span>
                  ) : (
                    <span className="text-green-500 font-bold">✓</span>
                  )}
                  <span className={rule.prohibited ? "text-muted-foreground" : "text-foreground"}>
                    {rule.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function ContentsTab({
  detail,
  viewMode,
  setViewMode,
  selectedContent,
  setSelectedContent,
  videoRef,
}: {
  detail: InfluencerDetailData
  viewMode: "grid" | "list"
  setViewMode: (v: "grid" | "list") => void
  selectedContent: BlingContentItem | null
  setSelectedContent: (c: BlingContentItem | null) => void
  videoRef: React.RefObject<HTMLVideoElement | null>
}) {
  const contents = detail.blingContents

  return (
    <div className="pt-6">
      <div className={cn(
        "flex flex-col",
        viewMode === "list" && "lg:flex-row lg:gap-8"
      )}>
        {/* Left: Content play area (list view) - with padding */}
        {viewMode === "list" && (
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="p-4 sm:p-6 lg:p-8 xl:px-16 xl:py-10 2xl:px-24 2xl:py-12 rounded-xl bg-muted/20 border border-border">
              {selectedContent ? (
                <ContentPlayArea content={selectedContent} videoRef={videoRef} />
              ) : (
                <div className="aspect-[9/16] max-w-md mx-auto flex items-center justify-center text-muted-foreground text-sm">
                  콘텐츠를 선택하세요
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Content list / grid */}
        <div className={cn(
          "flex-shrink-0",
          viewMode === "list" ? "lg:w-96 order-1 lg:order-2" : "w-full"
        )}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              {contents.length}개의 콘텐츠
            </span>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
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
                  viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="그리드 보기"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {contents.map((item) => (
                <Link
                  key={item.id}
                  href={`/contents/${item.id}`}
                  className="group block rounded-xl overflow-hidden border border-border hover:border-primary/50 bg-card"
                >
                  <div className="relative aspect-[9/16]">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/80 fill-white/80" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-sm font-semibold text-primary mt-1">{formatPrice(item.licensePrice)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {contents.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedContent(item)}
                  className={cn(
                    "w-full flex gap-4 p-3 rounded-xl border text-left transition-colors",
                    selectedContent?.id === item.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  )}
                >
                  <div className="relative w-16 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white/90" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{item.title}</p>
                    {item.viewCount != null && (
                      <p className="text-xs text-muted-foreground mt-0.5">{formatViewCount(item.viewCount)}</p>
                    )}
                    <p className="text-sm font-semibold text-primary mt-1">{formatPrice(item.licensePrice)}</p>
                    {item.secondaryCreation != null && (
                      <p className={cn("text-xs mt-1", SECONDARY_COLORS[item.secondaryCreation])}>
                        {SECONDARY_CREATION_LABELS[item.secondaryCreation]}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2차저작 콘텐츠 섹션 */}
      {detail.secondaryContents.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            블링 통해 제작된 2차저작 광고 콘텐츠
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.secondaryContents.map((item) => (
              <SecondaryContentCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ContentPlayArea({
  content,
  videoRef,
}: {
  content: BlingContentItem
  videoRef: React.RefObject<HTMLVideoElement | null>
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-[9/16] rounded-xl overflow-hidden bg-muted">
        {content.type === "video" && content.videoUrl ? (
          <>
            <video
              ref={videoRef}
              src={content.videoUrl}
              poster={content.thumbnailUrl}
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
            src={content.thumbnailUrl}
            alt={content.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground text-center">{content.title}</h3>
    </div>
  )
}

function SecondaryContentCard({ item }: { item: SecondaryContentItem }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <div className="relative aspect-video">
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, 300px"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{item.title}</h3>
        {item.advertiserReview && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                <Image
                  src={item.advertiserReview.profileImageUrl}
                  alt={item.advertiserReview.nickname}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.advertiserReview.nickname}
                  {item.advertiserReview.companyName && (
                    <span className="text-muted-foreground font-normal">
                      {" "}{item.advertiserReview.companyName}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{item.advertiserReview.content}</p>
          </div>
        )}
      </div>
    </div>
  )
}
