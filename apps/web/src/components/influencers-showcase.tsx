"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { ArrowRight, Play, Users } from "lucide-react"
import { Button } from "@bling/ui"

// 플랫폼 아이콘 (흰색 아웃라인 스타일)
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="YouTube">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Instagram">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="TikTok">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
}

type PlatformType = keyof typeof PLATFORM_ICONS

const MAX_PLATFORM_ICONS = 3

const influencers = [
  {
    name: "김수민",
    handle: "@beautykim",
    categories: ["뷰티", "스킨케어"],
    followers: "85K",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    platforms: ["youtube", "instagram"] as PlatformType[],
    media: {
      type: "video" as const,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop",
    },
  },
  {
    name: "박준호",
    handle: "@fitjohn",
    categories: ["피트니스", "헬스"],
    followers: "92K",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    platforms: ["instagram", "tiktok"] as PlatformType[],
    media: {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
    },
  },
  {
    name: "이지은",
    handle: "@daily_vibe",
    categories: ["라이프스타일"],
    followers: "156K",
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop",
    platforms: ["youtube", "instagram", "tiktok"] as PlatformType[],
    media: {
      type: "video" as const,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      posterUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
    },
  },
  {
    name: "최민재",
    handle: "@style_log",
    categories: ["패션", "스타일"],
    followers: "67K",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
    platforms: ["instagram", "youtube", "tiktok", "youtube", "instagram"] as PlatformType[], // 5개 → 3개 + "+ 2"
    media: {
      type: "image" as const,
      url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
    },
  },
]

function InfluencerCard({ influencer }: { influencer: (typeof influencers)[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleMouseEnter = () => {
    if (influencer.media.type === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (influencer.media.type === "video" && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  // 플랫폼: 최대 3개 아이콘, 초과 시 "+ N" 표시
  const displayPlatforms = influencer.platforms.slice(0, MAX_PLATFORM_ICONS)
  const extraCount = influencer.platforms.length - MAX_PLATFORM_ICONS

  return (
    <Link
      href="/influencers"
      className="group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-200 aspect-[3/4] min-h-[280px]">
        {/* 대표 이미지/영상 (전체 카드 배경) */}
        <div className="absolute inset-0">
          {influencer.media.type === "video" ? (
            <video
              ref={videoRef}
              src={influencer.media.url}
              poster={influencer.media.posterUrl}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Image
              src={influencer.media.url}
              alt={influencer.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        {/* 하단 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        {/* 우상단 재생 버튼 (영상일 때) */}
        {influencer.media.type === "video" && (
          <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center pointer-events-none">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        )}

        {/* 프로필 정보 (좌하단 오버레이) */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end gap-3">
            <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-white/30">
              <Image
                src={influencer.profileImage}
                alt={influencer.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base truncate">{influencer.name}</h3>
              <p className="text-sm text-primary truncate">{influencer.handle}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {influencer.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-0.5 text-xs rounded-full bg-white/20 text-white"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 하단 푸터: 팔로워 + 플랫폼 아이콘 */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center gap-1.5 text-white text-sm">
              <Users className="w-4 h-4 shrink-0" />
              <span>{influencer.followers} 팔로워</span>
            </div>
            <div className="flex items-center gap-2">
              {displayPlatforms.map((platform, i) => {
                const Icon = PLATFORM_ICONS[platform]
                if (!Icon) return null
                return (
                  <span key={`${platform}-${i}`} className="text-white">
                    <Icon className="w-5 h-5" />
                  </span>
                )
              })}
              {extraCount > 0 && (
                <span className="text-white/90 text-xs font-medium">+ {extraCount}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function InfluencersShowcase() {
  return (
    <section id="influencers" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
              인기 인플루언서
            </h2>
            <p className="text-muted-foreground max-w-xl">
              검증된 크리에이터들의 프로필을 확인하고 콘텐츠를 둘러보세요
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="text-primary hover:text-primary/90 group self-start sm:self-auto"
          >
            <Link href="/influencers">
              전체 보기
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {influencers.map((influencer) => (
            <InfluencerCard key={influencer.handle} influencer={influencer} />
          ))}
        </div>
      </div>
    </section>
  )
}
