"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Play, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { PLATFORM_ICONS } from "@/components/platform-icons"
import {
  INFLUENCERS_DATA,
  formatFollowerRange,
  type InfluencerItem,
  type PlatformType,
} from "@/data/influencers.json"

const CATEGORIES = [
  "전체",
  "뷰티",
  "패션",
  "푸드",
  "피트니스",
  "여행",
  "테크",
  "라이프스타일",
  "게임",
  "음악",
]

const SORT_OPTIONS = [
  { value: "recommended", label: "추천순" },
  { value: "popular", label: "인기순" },
  { value: "latest", label: "최신 가입순" },
  { value: "contents_desc", label: "콘텐츠 많은순" },
  { value: "rating", label: "평점순" },
]

const FOLLOWER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "-10k", label: "10k 이하" },
  { value: "10k-100k", label: "10k~100k" },
  { value: "100k-500k", label: "100k~500k" },
  { value: "500k-", label: "500k 이상" },
]

const CONTENTS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "10", label: "10개 이상" },
  { value: "50", label: "50개 이상" },
  { value: "100", label: "100개 이상" },
]

const PAGE_SIZE = 12

function matchesCategory(influencer: InfluencerItem, category: string): boolean {
  if (category === "전체") return true
  return influencer.category.startsWith(category)
}

function filterInfluencers(
  influencers: InfluencerItem[],
  category: string,
  sort: string,
  follower: string,
  minContents: string,
  type: string
): InfluencerItem[] {
  let result = influencers.filter((i) => matchesCategory(i, category))

  if (follower !== "all") {
    const maxMap: Record<string, number> = {
      "1k": 1000,
      "10k": 10000,
      "100k": 100000,
      "1m": 1000000,
      "1m_plus": Infinity,
    }
    const max = maxMap[follower]
    result = result.filter((i) => {
      if (!i.socialConnected) return false
      return i.followerCount <= max
    })
  }

  if (minContents !== "all") {
    const min = parseInt(minContents, 10)
    result = result.filter((i) => i.contentCount >= min)
  }

  if (type === "social") {
    result = result.filter((i) => i.socialConnected)
  } else if (type === "content_only") {
    result = result.filter((i) => !i.socialConnected)
  }

  if (sort === "popular") {
    result = [...result].sort((a, b) => b.followerCount - a.followerCount)
  } else if (sort === "latest") {
    result = [...result].reverse()
  } else if (sort === "contents_desc") {
    result = [...result].sort((a, b) => b.contentCount - a.contentCount)
  } else if (sort === "rating") {
    result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
  }

  return result
}

const MAX_PLATFORM_ICONS = 3

function PlatformIcons({ platforms }: { platforms: PlatformType[] }) {
  if (!platforms?.length) return null
  const display = platforms.slice(0, MAX_PLATFORM_ICONS)
  const extra = platforms.length - MAX_PLATFORM_ICONS

  return (
    <div className="flex items-center gap-1.5">
      {display.map((p, i) => {
        const Icon = PLATFORM_ICONS[p]
        return Icon ? <Icon key={`${p}-${i}`} className="w-5 h-5 text-muted-foreground" /> : null
      })}
      {extra > 0 && (
        <span className="text-xs text-muted-foreground">+{extra}</span>
      )}
    </div>
  )
}

function ContentCarousel({
  thumbnails,
  influencerId,
}: {
  thumbnails: { url: string; title: string }[]
  influencerId: string
}) {
  const [idx, setIdx] = useState(0)
  const items = thumbnails.length >= 2 ? thumbnails : [
    ...thumbnails,
    ...(thumbnails.length ? [thumbnails[0]] : []),
  ]
  const canPrev = items.length > 2 && idx > 0
  const canNext = items.length > 2 && idx < items.length - 2

  const visible = items.slice(idx, idx + 2)

  return (
    <div className="relative flex items-center gap-5 w-full min-w-0">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIdx((i) => Math.max(0, i - 1))
        }}
        className={cn(
          "absolute left-0 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-opacity",
          canPrev ? "opacity-100 hover:bg-black/70" : "pointer-events-none opacity-30"
        )}
        aria-label="이전"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex-1 flex gap-5 min-w-0 overflow-hidden">
        {visible.map((item, i) => (
          <div
            key={`${item.url}-${i}`}
            className="flex-1 min-w-[120px] group/card"
          >
            <div className="relative w-full overflow-hidden rounded-xl bg-muted">
              <div
                className="relative w-full"
                style={{ aspectRatio: "9 / 15.68", minHeight: 160 }}
              >
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 200px"
                  className="object-cover transition-transform group-hover/card:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white text-base font-medium truncate">
                {item.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIdx((i) => Math.min(items.length - 2, i + 1))
        }}
        className={cn(
          "absolute right-0 z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/50 text-white transition-opacity",
          canNext ? "opacity-100 hover:bg-black/70" : "pointer-events-none opacity-30"
        )}
        aria-label="다음"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}

function InfluencerCard({ influencer }: { influencer: InfluencerItem }) {
  const followerRange = formatFollowerRange(influencer.followerCount)
  const platforms = influencer.platforms ?? []
  const thumbnails = influencer.contentThumbnails ?? (influencer.coverImageUrl
    ? [{ url: influencer.coverImageUrl, title: influencer.name }]
    : [])

  const tags = influencer.category.split(/[·,]/).map((t) => t.trim()).filter(Boolean)

  return (
    <Link href={`/explore/influencers/${influencer.id}`} className="block">
      <article
        className="group flex flex-col md:flex-row rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-200"
        tabIndex={0}
      >
        {/* 좌측: 프로필 */}
        <div className="md:w-72 shrink-0 p-6 flex flex-col bg-muted/30 md:bg-muted/20">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="relative h-20 w-20 rounded-full overflow-hidden shrink-0">
              <Image
                src={influencer.profileImageUrl}
                alt={influencer.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 text-lg font-bold text-foreground">{influencer.name}</h3>
            <p className="text-sm text-primary">{influencer.handle}</p>

            {followerRange != null && (
              <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 shrink-0" />
                <span>{followerRange} 팔로워</span>
              </div>
            )}

            {influencer.bio && (
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {influencer.bio}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {platforms.length > 0 && (
              <div className="mt-4">
                <PlatformIcons platforms={platforms} />
              </div>
            )}

            <div className="mt-4 w-full">
              <span className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-background border border-border text-sm font-medium text-foreground group-hover:border-primary/50 transition-colors">
                프로필 보기
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* 우측: 콘텐츠 캐러셀 */}
        <div className="flex-1 min-w-0 p-6 flex items-center min-h-[240px] overflow-hidden">
          {thumbnails.length > 0 ? (
            <ContentCarousel thumbnails={thumbnails} influencerId={influencer.id} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              등록된 콘텐츠가 없습니다
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors"
      >
        {label}: {options.find((o) => o.value === value)?.label}
        <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute top-full left-0 mt-1 py-1 min-w-[140px] bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  "w-full px-3 py-2 text-left text-sm transition-colors",
                  opt.value === value
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function InfluencersFilters({
  category,
  sort,
  follower,
  minContents,
  type,
  onCategoryChange,
  onSortChange,
  onFollowerChange,
  onContentsChange,
  onTypeChange,
}: {
  category: string
  sort: string
  follower: string
  minContents: string
  type: string
  onCategoryChange: (v: string) => void
  onSortChange: (v: string) => void
  onFollowerChange: (v: string) => void
  onContentsChange: (v: string) => void
  onTypeChange: (v: string) => void
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                category === cat
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "border border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground"
              )}
            >
              {cat === "전체" ? cat : `#${cat}`}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="정렬"
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
          <FilterDropdown
            label="팔로워"
            value={follower}
            options={FOLLOWER_OPTIONS}
            onChange={onFollowerChange}
          />
          <FilterDropdown
            label="콘텐츠 수"
            value={minContents}
            options={CONTENTS_OPTIONS}
            onChange={onContentsChange}
          />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-4xl mb-4">👥</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">검색 결과가 없습니다</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        선택한 필터 조건에 맞는 인플루언서를 찾을 수 없습니다.
        <br />
        필터를 조정하거나 다른 카테고리를 선택해보세요.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        필터 초기화
      </button>
    </div>
  )
}

export default function InfluencersPage() {
  const [category, setCategory] = useState("전체")
  const [sort, setSort] = useState("recommended")
  const [follower, setFollower] = useState("all")
  const [minContents, setMinContents] = useState("all")
  const [type, setType] = useState("all")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)

  const filtered = filterInfluencers(
    INFLUENCERS_DATA,
    category,
    sort,
    follower,
    minContents,
    type
  )
  const displayed = filtered.slice(0, (page + 1) * PAGE_SIZE)
  const hasMore = displayed.length < filtered.length

  const setFilterAndResetPage = useCallback(
    (setter: (v: string) => void, value: string) => {
      setter(value)
      setPage(0)
    },
    []
  )

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    setLoading(true)
    setTimeout(() => {
      setPage((p) => p + 1)
      setLoading(false)
    }, 400)
  }, [loading, hasMore])

  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRefCallback = useCallback(
    (el: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!el) return
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) loadMore()
        },
        { threshold: 0.1, rootMargin: "100px" }
      )
      observerRef.current.observe(el)
    },
    [loadMore]
  )

  const resetFilters = () => {
    setCategory("전체")
    setSort("recommended")
    setFollower("all")
    setMinContents("all")
    setType("all")
    setPage(0)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">인플루언서</h1>
          <p className="text-muted-foreground">
            검증된 크리에이터들의 프로필을 확인하고 콘텐츠를 둘러보세요
          </p>
        </div>

        <InfluencersFilters
          category={category}
          sort={sort}
          follower={follower}
          minContents={minContents}
          type={type}
          onCategoryChange={(v) => setFilterAndResetPage(setCategory, v)}
          onSortChange={(v) => setFilterAndResetPage(setSort, v)}
          onFollowerChange={(v) => setFilterAndResetPage(setFollower, v)}
          onContentsChange={(v) => setFilterAndResetPage(setMinContents, v)}
          onTypeChange={(v) => setFilterAndResetPage(setType, v)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {displayed.map((influencer) => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))}
              </div>

              <div ref={loadMoreRefCallback} className="h-20 flex items-center justify-center">
                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    인플루언서를 불러오는 중...
                  </div>
                )}
                {hasMore && !loading && <div className="h-4" />}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
