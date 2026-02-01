"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Play, Eye, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const categories = ["전체", "뷰티", "패션", "푸드", "피트니스", "여행", "테크"]

const contents = [
  {
    title: "데일리 스킨케어 루틴",
    creator: "@beautykim",
    category: "뷰티",
    price: "₩350,000",
    views: "124K",
    likes: "8.2K",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop",
    isVideo: true,
  },
  {
    title: "홈트레이닝 챌린지",
    creator: "@fitjohn",
    category: "피트니스",
    price: "₩280,000",
    views: "89K",
    likes: "6.1K",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    isVideo: true,
  },
  {
    title: "홍콩 맛집 투어",
    creator: "@foodpark",
    category: "푸드",
    price: "₩420,000",
    views: "203K",
    likes: "15K",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop",
    isVideo: true,
  },
  {
    title: "제주 감성 VLOG",
    creator: "@travellee",
    category: "여행",
    price: "₩530,000",
    views: "156K",
    likes: "11K",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop",
    isVideo: true,
  },
]

export function ContentsShowcase() {
  const [activeCategory, setActiveCategory] = useState("전체")

  const filteredContents =
    activeCategory === "전체"
      ? contents
      : contents.filter((c) => c.category === activeCategory)

  return (
    <section id="contents" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              실시간 인기 숏폼 콘텐츠
            </h2>
            <p className="text-muted-foreground max-w-xl">
              지금 바로 라이센스 구매가 가능한 트렌디한 영상 콘텐츠
            </p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary/90 group self-start sm:self-auto">
            <Link href="/contents">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredContents.map((content) => (
            <ContentCard key={content.creator} content={content} />
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <Button variant="outline" className="border-border bg-transparent hover:bg-muted text-foreground px-8">
            더 많은 콘텐츠 보기
          </Button>
        </div>
      </div>
    </section>
  )
}

function ContentCard({ content }: { content: (typeof contents)[0] }) {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all">
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={content.image || "/placeholder.svg"}
          alt={content.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium text-white bg-secondary/80 rounded-full">
            {content.category}
          </span>
        </div>

        {/* Video Duration / Play Button */}
        {content.isVideo && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
            <Play className="w-3 h-3 text-white fill-white" />
            <span className="text-xs text-white">0:45</span>
          </div>
        )}

        {/* Stats Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-4">
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <Eye className="w-4 h-4" />
            <span>{content.views}</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 text-sm">
            <Heart className="w-4 h-4" />
            <span>{content.likes}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-1 truncate">{content.title}</h3>
        <p className="text-sm text-primary mb-3">{content.creator}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">{content.price}</span>
          <Button size="sm" className="bg-primary/10 hover:bg-primary/20 text-primary">
            라이센스
          </Button>
        </div>
      </div>
    </div>
  )
}
