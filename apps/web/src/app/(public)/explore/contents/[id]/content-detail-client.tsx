"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Bookmark,
  Eye,
  Heart,
} from "lucide-react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Textarea,
  Label,
} from "@bling/ui"
import { cn } from "@/lib/utils"
import type { ContentDetailData, LicensePriceOption } from "@/data/content-detail"
import type { BlingContentItem } from "@/data/influencer-detail"
import { SECONDARY_CREATION_LABELS } from "@/data/content-detail"

function formatPrice(price: number): string {
  return `₩${price.toLocaleString()}`
}

function formatCount(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toLocaleString()
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function ContentDetailClient({ content }: { content: ContentDetailData }) {
  const [selectedDuration, setSelectedDuration] = useState(() => {
    const idx = content.licensePrices?.findIndex((o) => o.isRecommended) ?? -1
    return idx >= 0 ? idx : 0
  })
  const [showPrecautions, setShowPrecautions] = useState(false)
  const [showCommissionDialog, setShowCommissionDialog] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const licensePrices = content.licensePrices ?? (
    typeof content.licensePrice === "number"
      ? [{ duration: "1개월", price: content.licensePrice }]
      : []
  )
  const hasFixedPrice = content.licensePrice !== "협의" && licensePrices.length > 0

  const selectedOption = licensePrices[selectedDuration]
  const displayPrice = selectedOption
    ? selectedOption.discountPrice ?? selectedOption.price
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Back link */}
      <div className="mt-6 mb-6">
        <Link
          href={`/explore/influencers/${content.influencerId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          목록으로
        </Link>
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Left: Media */}
        <MediaSection content={content} />

        {/* Right: Info */}
        <div className="flex-1 min-w-0 lg:max-w-xl">
          {/* Title + Bookmark */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="mt-1 shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label={isBookmarked ? "북마크 해제" : "북마크"}
            >
              <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-primary text-primary")} />
            </button>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {content.title}
            </h1>
          </div>

          {/* Creator Profile Block */}
          <CreatorProfileBlock content={content} />

          {/* External Platform Links */}
          {content.externalLinks && content.externalLinks.length > 0 && (
            <div className="mt-4 pb-5 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2">다른 플랫폼에서 보기</p>
              <div className="flex flex-wrap gap-2">
                {content.externalLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted/50 text-sm text-foreground transition-colors"
                  >
                    {link.platform}
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <ExpandableDescription description={content.description} />

          {/* Licensing Info */}
          <LicensingSection
            content={content}
            licensePrices={licensePrices}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />

          {/* Commission Price Summary */}
          <CommissionPriceSummary content={content} />

          {/* Precautions */}
          {content.precautions && content.precautions.length > 0 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowPrecautions(!showPrecautions)}
                className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
              >
                구매 전 유의사항
                {showPrecautions ? (
                  <ChevronUp className="w-4 h-4 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 shrink-0" />
                )}
              </button>
              {showPrecautions && (
                <ul className="mt-3 pl-5 space-y-1.5 text-sm text-muted-foreground list-disc">
                  {content.precautions.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            {hasFixedPrice && displayPrice != null && displayPrice > 0 && (
              <Button size="lg" className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                구매하기 · {formatPrice(displayPrice)}
              </Button>
            )}
            <Button
              variant={hasFixedPrice ? "outline" : "default"}
              size="lg"
              className={cn("flex-1", !hasFixedPrice && "bg-gradient-to-r from-primary to-secondary hover:opacity-90")}
              onClick={() => setShowCommissionDialog(true)}
            >
              의뢰하기
            </Button>
          </div>

          {/* Bottom actions */}
          <div className="mt-5 pt-4 border-t border-border flex items-center gap-5">
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
              <Heart className="w-4 h-4" />
              좋아요
            </button>
          </div>
        </div>
      </div>

      {/* Creator's other content */}
      <CreatorOtherContentsSection
        contents={content.creatorOtherContents}
        influencerId={content.influencerId}
      />

      {/* Commission Dialog */}
      <CommissionDialog
        open={showCommissionDialog}
        onOpenChange={setShowCommissionDialog}
        content={content}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MediaSection({ content }: { content: ContentDetailData }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  return (
    <div className="flex-1 min-w-0 lg:max-w-[480px]">
      <div className="relative aspect-[9/16] max-w-md mx-auto rounded-2xl overflow-hidden bg-muted">
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
              <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <Image
            src={content.thumbnailUrl}
            alt={content.title}
            fill
            sizes="(max-width: 1024px) 100vw, 480px"
            className="object-cover"
            priority
          />
        )}

        {/* Category badge - top left */}
        {content.category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 text-xs font-medium text-white bg-secondary/80 backdrop-blur-sm rounded-full">
              {content.category}
            </span>
          </div>
        )}

        {/* Bottom overlays */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-12 pb-3 px-3 z-10">
          <div className="flex items-center justify-between">
            {content.viewCount != null && (
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <Eye className="w-4 h-4" />
                <span>조회 {formatCount(content.viewCount)}</span>
              </div>
            )}
            {content.likeCount != null && (
              <div className="flex items-center gap-1 text-white/90 text-sm">
                <Heart className="w-4 h-4" />
                <span>좋아요 {formatCount(content.likeCount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CreatorProfileBlock({ content }: { content: ContentDetailData }) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border border-border">
        <Image
          src={content.influencerProfileImageUrl}
          alt={content.influencerName}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm">{content.influencerName}</p>
        <p className="text-xs text-primary">{content.influencerHandle}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground">{content.influencerCategory}</span>
          {content.influencerFollowerSummary && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{content.influencerFollowerSummary}</span>
            </>
          )}
        </div>
      </div>
      <Link href={`/explore/influencers/${content.influencerId}`}>
        <Button variant="outline" size="sm" className="shrink-0 text-xs">
          프로필 보기
        </Button>
      </Link>
    </div>
  )
}

function ExpandableDescription({ description }: { description?: string }) {
  const [expanded, setExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    setIsOverflowing(el.scrollHeight > el.clientHeight)
  }, [description])

  if (!description) return null

  return (
    <div className="mt-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">콘텐츠 설명</h3>
      <div
        ref={contentRef}
        className={cn(
          "text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap overflow-hidden transition-[max-height] duration-300",
          !expanded && "max-h-[4.5rem]"
        )}
      >
        {description}
      </div>
      {isOverflowing && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-1.5 text-sm text-primary hover:underline"
        >
          ...더보기
        </button>
      )}
      {expanded && isOverflowing && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="mt-1.5 text-sm text-primary hover:underline"
        >
          접기
        </button>
      )}
    </div>
  )
}

function LicensingSection({
  content,
  licensePrices,
  selectedDuration,
  setSelectedDuration,
}: {
  content: ContentDetailData
  licensePrices: LicensePriceOption[]
  selectedDuration: number
  setSelectedDuration: (i: number) => void
}) {
  return (
    <div className="mt-6 p-5 rounded-xl bg-card border border-border">
      {/* 2차 저작 허용 */}
      {content.secondaryCreation != null && (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <span className="text-sm text-muted-foreground">2차 저작 허용</span>
          <span
            className={cn(
              "text-sm font-medium",
              content.secondaryCreation === 3 && "text-green-400",
              content.secondaryCreation === 2 && "text-yellow-400",
              content.secondaryCreation === 1 && "text-red-400"
            )}
          >
            {SECONDARY_CREATION_LABELS[content.secondaryCreation]}
          </span>
        </div>
      )}

      {/* 사용 기간 */}
      <h3 className="text-sm font-medium text-muted-foreground mb-3">사용 기간</h3>

      {content.licensePrice === "협의" && licensePrices.length === 0 ? (
        <p className="text-lg font-semibold text-foreground">금액 협의</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {licensePrices.map((opt, i) => {
            const isNegotiable = opt.price === 0
            return (
              <button
                key={opt.duration}
                type="button"
                onClick={() => setSelectedDuration(i)}
                className={cn(
                  "relative flex flex-col items-start px-4 py-3.5 rounded-xl border text-left transition-all",
                  selectedDuration === i
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-primary/40"
                )}
              >
                {/* Recommended badge */}
                {opt.isRecommended && (
                  <span className="absolute -top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-semibold text-white bg-secondary rounded-full">
                    추천
                  </span>
                )}
                {/* Selected checkmark */}
                {selectedDuration === i && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{opt.duration}</span>
                {isNegotiable ? (
                  <span className="mt-1 text-sm font-semibold text-foreground">협의 필요</span>
                ) : opt.discountPrice != null ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs line-through text-muted-foreground">
                      {formatPrice(opt.price)}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {formatPrice(opt.discountPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="mt-1 text-sm font-bold text-foreground">
                    {formatPrice(opt.price)}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function CommissionPriceSummary({ content }: { content: ContentDetailData }) {
  if (!content.commissionPriceMin) return null

  const priceText = content.commissionPriceMax
    ? `${formatPrice(content.commissionPriceMin)} ~ ${formatPrice(content.commissionPriceMax)}`
    : `${formatPrice(content.commissionPriceMin)}부터~`

  return (
    <div className="mt-4 p-4 rounded-xl bg-muted/30 border border-border">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">의뢰 제작 비용</h3>
      <p className="text-lg font-bold text-foreground">{priceText}</p>
      <p className="text-xs text-muted-foreground mt-1">
        크리에이터가 광고 콘텐츠를 제작하고 본인 SNS에 게시합니다
      </p>
    </div>
  )
}

function CreatorOtherContentsSection({
  contents,
  influencerId,
}: {
  contents?: BlingContentItem[]
  influencerId: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!contents || contents.length === 0) return null

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    })
  }

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">
          이 크리에이터의 다른 콘텐츠
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="이전"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            aria-label="다음"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <Link
            href={`/explore/influencers/${influencerId}`}
            className="text-sm text-primary hover:underline ml-2"
          >
            전체보기
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {contents.map((item) => (
          <Link
            key={item.id}
            href={`/explore/contents/${item.id}`}
            className="group flex-shrink-0 w-[180px] snap-start"
          >
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
              <Image
                src={item.thumbnailUrl}
                alt={item.title}
                fill
                sizes="180px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Price badge */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                {typeof item.licensePrice === "number"
                  ? formatPrice(item.licensePrice)
                  : "협의"}
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-foreground truncate">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Commission Dialog
// ---------------------------------------------------------------------------

function CommissionDialog({
  open,
  onOpenChange,
  content,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: ContentDetailData
}) {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    productName: "",
    requirements: "",
    budget: "",
    deadline: "",
    additionalNotes: "",
  })

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission - future API integration
    console.log("Commission request:", { contentId: content.id, creatorId: content.influencerId, ...formData })
    setSubmitted(true)
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after closing animation
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        companyName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        productName: "",
        requirements: "",
        budget: "",
        deadline: "",
        additionalNotes: "",
      })
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>콘텐츠 제작 의뢰</DialogTitle>
          <DialogDescription>
            {content.influencerName}님에게 광고 콘텐츠 제작을 의뢰합니다.
            요청사항을 작성해주시면 블링 팀이 확인 후 연락드립니다.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-foreground">의뢰가 접수되었습니다!</p>
            <p className="text-sm text-muted-foreground mt-2">
              블링 팀이 확인 후 입력하신 이메일로 연락드리겠습니다.
            </p>
            <Button className="mt-6" onClick={handleClose}>닫기</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="companyName">회사명 *</Label>
                <Input
                  id="companyName"
                  required
                  placeholder="회사명"
                  value={formData.companyName}
                  onChange={handleChange("companyName")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactName">담당자명 *</Label>
                <Input
                  id="contactName"
                  required
                  placeholder="담당자명"
                  value={formData.contactName}
                  onChange={handleChange("contactName")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="contactEmail">이메일 *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={formData.contactEmail}
                  onChange={handleChange("contactEmail")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactPhone">연락처</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.contactPhone}
                  onChange={handleChange("contactPhone")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="productName">제품/서비스명 *</Label>
              <Input
                id="productName"
                required
                placeholder="광고할 제품 또는 서비스명"
                value={formData.productName}
                onChange={handleChange("productName")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements">요청사항 *</Label>
              <Textarea
                id="requirements"
                rows={4}
                required
                placeholder="원하시는 콘텐츠 방향, 키 메시지, 레퍼런스 등을 작성해주세요"
                value={formData.requirements}
                onChange={handleChange("requirements")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="budget">예산 범위</Label>
                <Input
                  id="budget"
                  placeholder="예: 200만원~300만원"
                  value={formData.budget}
                  onChange={handleChange("budget")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="deadline">희망 일정</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange("deadline")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="additionalNotes">기타 참고사항</Label>
              <Textarea
                id="additionalNotes"
                rows={2}
                placeholder="추가적으로 전달할 내용이 있다면 작성해주세요"
                value={formData.additionalNotes}
                onChange={handleChange("additionalNotes")}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit">의뢰 접수하기</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
