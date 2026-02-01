"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Play, Heart, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CONTENTS_DATA,
  formatPriceRange,
  getFollowerRangeLabel,
  type ContentItem,
} from "@/data/contents.json"

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
]

const LICENSE_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "exclusive", label: "독점 가능" },
  { value: "non_exclusive", label: "비독점만" },
]

const FOLLOWER_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "1k", label: "1K 이하" },
  { value: "10k", label: "10K 이하" },
  { value: "100k", label: "100K 이하" },
  { value: "1m", label: "1M 이하" },
  { value: "1m_plus", label: "1M 이상" },
]

const PAGE_SIZE = 9

function filterContents(
  contents: ContentItem[],
  category: string,
  sort: string,
  license: string,
  follower: string
): ContentItem[] {
  let result = [...contents]

  if (category !== "전체") {
    result = result.filter((c) => c.category === category)
  }

  if (license === "exclusive") {
    result = result.filter((c) => c.priceRange.min !== c.priceRange.max)
  } else if (license === "non_exclusive") {
    result = result.filter((c) => c.priceRange.min === c.priceRange.max)
  }

  if (follower !== "all") {
    const maxMap: Record<string, number> = {
      "1k": 1000,
      "10k": 10000,
      "100k": 100000,
      "1m": 1000000,
      "1m_plus": Infinity,
    }
    const max = maxMap[follower]
    result = result.filter((c) => {
      if (!c.creator.followerRange) return false
      return c.creator.followerRange.max <= max
    })
  }

  if (sort === "popular") {
    result = [...result].reverse()
  }

  return result
}

function ContentCard({ content }: { content: ContentItem }) {
  const priceDisplay =
    content.priceRange.min === content.priceRange.max
      ? formatPriceRange(content.priceRange.min, content.priceRange.min)
      : formatPriceRange(content.priceRange.min, content.priceRange.max)
  const followerLabel =
    content.creator.socialConnected && content.creator.followerRange
      ? getFollowerRangeLabel(
          content.creator.followerRange.min,
          content.creator.followerRange.max
        )
      : null

  return (
    <Link href={`/contents/${content.id}`}>
      <article
        className="group relative aspect-[9/16] min-w-[280px] max-w-[400px] w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30"
        tabIndex={0}
      >
        <Image
          src={content.thumbnailUrl}
          alt={content.category}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* 하단 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* 상단: 태그 좌측, 가격+북마크 우측 */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <span className="px-2 py-1 text-xs font-bold text-white bg-black/60 rounded">
            #{content.category}
          </span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-bold text-white bg-black/60 rounded">
              {priceDisplay}
            </span>
            <button
              type="button"
              className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="북마크"
              onClick={(e) => e.preventDefault()}
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 중앙: 재생 버튼 */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center transition-all duration-200 group-hover:bg-white/50 group-hover:scale-110">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>

        {/* 하단: 크리에이터 정보 */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white shrink-0">
              <Image
                src={content.creator.profileImageUrl}
                alt={content.creator.nickname}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {content.creator.nickname}
              </p>
              {followerLabel && (
                <p className="text-xs text-white/80">팔로워 {followerLabel}</p>
              )}
            </div>
          </div>
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
          <div className="absolute top-full left-0 mt-1 py-1 min-w-[140px] bg-card border border-border rounded-lg shadow-xl z-50">
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

function ContentsFilters({
  category,
  sort,
  license,
  follower,
  onCategoryChange,
  onSortChange,
  onLicenseChange,
  onFollowerChange,
}: {
  category: string
  sort: string
  license: string
  follower: string
  onCategoryChange: (v: string) => void
  onSortChange: (v: string) => void
  onLicenseChange: (v: string) => void
  onFollowerChange: (v: string) => void
}) {
  return (
    <div className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* 카테고리 칩 */}
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

        {/* 추가 필터 */}
        <div className="flex flex-wrap gap-2">
          <FilterDropdown
            label="정렬"
            value={sort}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
          <FilterDropdown
            label="라이센스"
            value={license}
            options={LICENSE_OPTIONS}
            onChange={onLicenseChange}
          />
          <FilterDropdown
            label="팔로워"
            value={follower}
            options={FOLLOWER_OPTIONS}
            onChange={onFollowerChange}
          />
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        검색 결과가 없습니다
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        선택한 필터 조건에 맞는 콘텐츠를 찾을 수 없습니다.
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

export default function ContentsPage() {
  const [category, setCategory] = useState("전체")
  const [sort, setSort] = useState("recommended")
  const [license, setLicense] = useState("all")
  const [follower, setFollower] = useState("all")
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const filtered = filterContents(CONTENTS_DATA, category, sort, license, follower)
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

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore()
      },
      { threshold: 0.1, rootMargin: "100px" }
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [loadMore])

  const resetFilters = () => {
    setCategory("전체")
    setSort("recommended")
    setLicense("all")
    setFollower("all")
    setPage(0)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* 페이지 헤더 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            숏폼 콘텐츠
          </h1>
          <p className="text-muted-foreground">
            검증된 인플루언서의 숏폼 영상을 라이센스하세요
          </p>
        </div>

        {/* 필터 */}
        <ContentsFilters
          category={category}
          sort={sort}
          license={license}
          follower={follower}
          onCategoryChange={(v) => setFilterAndResetPage(setCategory, v)}
          onSortChange={(v) => setFilterAndResetPage(setSort, v)}
          onLicenseChange={(v) => setFilterAndResetPage(setLicense, v)}
          onFollowerChange={(v) => setFilterAndResetPage(setFollower, v)}
        />

        {/* 콘텐츠 그리드 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((content) => (
                  <ContentCard key={content.id} content={content} />
                ))}
              </div>

              {/* 무한 스크롤 트리거 */}
              <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    콘텐츠를 불러오는 중...
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
