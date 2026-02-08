"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, Share2, Calendar, Tag } from "lucide-react"
import { Button } from "@bling/ui"
import { cn } from "@/lib/utils"
import type { ContestDetailData } from "@/data/contest-detail"
import {
  getDaysUntilEnd,
  parseApplicationEndDate,
} from "@/data/contest-detail"

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-foreground mb-3 mt-8 first:mt-0">
      {children}
    </h2>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-foreground bg-muted/30 hover:bg-muted/50 transition-colors"
        aria-expanded={open}
      >
        {title}
        {open ? (
          <ChevronUp className="w-4 h-4 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-border bg-background text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

export function ContestDetailClient({ contest }: { contest: ContestDetailData }) {
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null)
  const [legalOpen, setLegalOpen] = useState(false)

  const endDate = parseApplicationEndDate(contest.applicationPeriod)
  const daysLeft = getDaysUntilEnd(endDate)
  const showDday = daysLeft !== null && daysLeft >= 0

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.share) {
      try {
        await navigator.share({
          title: contest.title,
          text: contest.summary,
          url,
        })
      } catch {
        await navigator.clipboard?.writeText(url)
      }
    } else {
      await navigator.clipboard?.writeText(url)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-40 md:pb-24">
      <div className="flex items-center justify-between mt-6 mb-4">
        <Link
          href="/explore/contests"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          컨테스트 목록으로
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="공유하기"
        >
          <Share2 className="w-4 h-4" />
          공유하기
        </button>
      </div>

      <div className="relative w-full aspect-[16/9] max-h-[360px] rounded-xl overflow-hidden bg-muted">
        <Image
          src={contest.posterImageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 896px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
            {contest.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          접수 {contest.applicationPeriod}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          발표 {contest.announcementDate}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Tag className="w-4 h-4" />
          {contest.contentType}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-muted text-foreground text-xs font-medium">
          {contest.type}
        </span>
        {showDday && (
          <span
            className={cn(
              "px-2.5 py-1 rounded-md text-xs font-semibold",
              daysLeft === 0
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/20 text-primary"
            )}
          >
            {daysLeft === 0 ? "D-Day" : `D-${daysLeft}`}
          </span>
        )}
      </div>

      <SectionTitle>내용</SectionTitle>
      <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
        {contest.content}
      </div>

      {contest.benefits && (
        <>
          <SectionTitle>혜택</SectionTitle>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {contest.benefits}
          </div>
        </>
      )}

      {contest.platforms && contest.platforms.length > 0 && (
        <>
          <SectionTitle>게시될 플랫폼</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {contest.platforms.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-lg border border-border bg-muted/30 text-sm text-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </>
      )}

      {(contest.supportConditions || contest.eligibility) && (
        <>
          <SectionTitle>지원조건</SectionTitle>
          <p className="text-sm text-muted-foreground">
            {contest.supportConditions ?? contest.eligibility}
          </p>
        </>
      )}

      {contest.etc && (
        <>
          <SectionTitle>기타</SectionTitle>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {contest.etc}
          </p>
        </>
      )}

      {contest.faq && contest.faq.length > 0 && (
        <>
          <SectionTitle>공통 Q&A</SectionTitle>
          <div className="space-y-2">
            {contest.faq.map((item, i) => (
              <Accordion
                key={i}
                title={item.question}
                open={faqOpenIndex === i}
                onToggle={() =>
                  setFaqOpenIndex(faqOpenIndex === i ? null : i)
                }
              >
                {item.answer}
              </Accordion>
            ))}
          </div>
        </>
      )}

      {contest.legalNotice && (
        <>
          <SectionTitle>법적·운영 안내</SectionTitle>
          <Accordion
            title="법적·운영 안내 읽기"
            open={legalOpen}
            onToggle={() => setLegalOpen(!legalOpen)}
          >
            {contest.legalNotice}
          </Accordion>
        </>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border md:relative md:mt-10 md:p-0 md:bg-transparent md:border-0 md:backdrop-blur-none">
        <div className="max-w-3xl mx-auto md:max-w-none">
          <Button size="lg" className="w-full md:w-auto" asChild>
            <Link href="#">참가하기</Link>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground text-center md:text-left">
            참가 신청은 추후 연동 예정입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
