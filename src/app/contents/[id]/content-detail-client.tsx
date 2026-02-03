"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Play, ExternalLink, ChevronDown, ChevronUp, MessageCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ContentDetailData } from "@/data/content-detail"
import { SECONDARY_CREATION_LABELS } from "@/data/content-detail"

const DESCRIPTION_TRUNCATE_LENGTH = 80

function formatPrice(price: number): string {
  return `₩${price.toLocaleString()}`
}

export function ContentDetailClient({ content }: { content: ContentDetailData }) {
  const [showPrecautions, setShowPrecautions] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const licensePrices = content.licensePrices ?? (typeof content.licensePrice === "number"
    ? [{ duration: "1개월", price: content.licensePrice }]
    : [])
  const hasFixedPrice = content.licensePrice !== "협의" && licensePrices.length > 0
  const description = content.description ?? ""
  const isDescriptionLong = description.length > DESCRIPTION_TRUNCATE_LENGTH
  const displayDescription = showFullDescription || !isDescriptionLong
    ? description
    : `${description.slice(0, DESCRIPTION_TRUNCATE_LENGTH)}...`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Back / Close - could use router.back() or link to influencer */}
      <div className="flex items-center justify-between mt-6 mb-4">
        <Link
          href={`/influencers/${content.influencerId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← 인플루언서 프로필
        </Link>
        <Link
          href={`/influencers/${content.influencerId}`}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </Link>
      </div>

      {/* Layout: lg+ = side by side (left media, right info), below lg = stacked */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Left: Media area */}
        <div className="flex-1 min-w-0 lg:max-w-[500px]">
          <div className="relative aspect-[9/16] max-w-md mx-auto rounded-xl overflow-hidden bg-muted">
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
                  <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </div>
                </div>
              </>
            ) : (
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Right: Info area */}
        <div className="flex-1 min-w-0 lg:max-w-md">
          <div className="p-6 rounded-xl bg-card border border-border">
            {content.externalLinks && content.externalLinks.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">다른 플랫폼에서 보기</h3>
                <div className="flex flex-wrap gap-2">
                  {content.externalLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted/50 text-sm text-foreground transition-colors"
                    >
                      {link.platform}
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <h1 className="text-xl font-bold text-foreground">{content.title}</h1>

            {description && (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {displayDescription}
                </p>
                {isDescriptionLong && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    {showFullDescription ? "접기" : "더보기"}
                  </button>
                )}
              </div>
            )}

            {/* 2차 저작 허용 */}
            {content.secondaryCreation != null && (
              <div className="mt-4">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-md text-sm font-medium",
                    content.secondaryCreation === 3 && "bg-green-500/20 text-green-600 dark:text-green-400",
                    content.secondaryCreation === 2 && "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400",
                    content.secondaryCreation === 1 && "bg-red-500/20 text-red-600 dark:text-red-400"
                  )}
                >
                  2차 저작 {SECONDARY_CREATION_LABELS[content.secondaryCreation]}
                </span>
              </div>
            )}

            {/* 라이센싱 가격 */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">라이센싱 가격</h3>
              {content.licensePrice === "협의" && licensePrices.length === 0 ? (
                <p className="text-lg font-semibold text-foreground">금액 협의</p>
              ) : licensePrices.length > 0 ? (
                <div className="space-y-2">
                  {licensePrices.map((opt, i) => (
                    <button
                      key={opt.duration}
                      type="button"
                      onClick={() => setSelectedDuration(i)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors",
                        selectedDuration === i
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span>{opt.duration}</span>
                      <span className="font-semibold">{formatPrice(opt.price)}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-lg font-semibold text-foreground">{formatPrice(content.licensePrice as number)}</p>
              )}
            </div>

            {/* 구매 전 유의사항 */}
            {content.precautions && content.precautions.length > 0 && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setShowPrecautions(!showPrecautions)}
                  className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  구매 전 유의사항 읽기
                  {showPrecautions ? (
                    <ChevronUp className="w-4 h-4 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 shrink-0" />
                  )}
                </button>
                {showPrecautions && (
                  <ul className="mt-2 pl-4 space-y-1.5 text-sm text-muted-foreground list-disc">
                    {content.precautions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <Button size="lg" className="w-full">
                {hasFixedPrice ? "구매하기" : "의뢰하기"}
              </Button>
              {hasFixedPrice && (
                <Button variant="outline" size="lg" className="w-full">
                  의뢰하기
                </Button>
              )}
            </div>

            {/* Bottom actions */}
            <div className="mt-6 pt-4 border-t border-border flex gap-6">
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                질문하기
              </button>
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                북마크
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
