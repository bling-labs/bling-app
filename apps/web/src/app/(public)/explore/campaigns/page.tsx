"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, ChevronDown, ChevronRight, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CAMPAIGNS_DATA,
  formatCurrency,
  formatFollowers,
  getCompetitionLabel,
  getFitLabel,
  type CampaignItem,
  type FitAnalysis,
} from "@/data/campaigns"

const CATEGORIES = [
  "전체",
  "뷰티",
  "패션",
  "푸드",
  "피트니스",
  "여행",
  "테크",
  "라이프스타일",
]

type AnalysisState = "idle" | "loading" | "done"

function ProgressBar({ value, barColor }: { value: number; barColor: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted">
      <div
        className={cn("h-1.5 rounded-full transition-all duration-700", barColor)}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function FitAnalysisPanel({
  campaign,
  analysisState,
  onAnalyze,
  statsOpen,
  onToggleStats,
}: {
  campaign: CampaignItem
  analysisState: AnalysisState
  onAnalyze: () => void
  statsOpen: boolean
  onToggleStats: () => void
}) {
  const fit = campaign.fitAnalysis
  const ratio = campaign.applicantCount / campaign.recruitCount
  const comp = getCompetitionLabel(ratio)

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        {analysisState === "idle" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <div className="relative mb-3">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-full" />
              <Sparkles className="relative w-8 h-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              나와의 캠페인<br />적합성이 궁금하다면?
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onAnalyze()
              }}
              className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              적합성 분석
            </button>
          </div>
        )}

        {analysisState === "loading" && (
          <div className="flex flex-col items-center justify-center h-full text-center px-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin mb-3" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              AI가 채널 데이터를<br />분석하고 있습니다
            </p>
          </div>
        )}

        {analysisState === "done" && (
          <div className="space-y-3 px-1">
            <p className="text-xs font-semibold text-foreground">적합성 분석 결과</p>
            <div className="text-center py-2">
              <span className="text-2xl font-bold text-foreground">{fit.overallScore}</span>
              <span className="text-xs text-muted-foreground ml-1">점</span>
              <span className={cn("text-xs font-medium ml-2", getFitLabel(fit.overallScore).color)}>
                {getFitLabel(fit.overallScore).label}
              </span>
              <div className="mt-1.5">
                <ProgressBar value={fit.overallScore} barColor={getFitLabel(fit.overallScore).barColor} />
              </div>
            </div>
            {[
              { label: "카테고리", value: fit.categoryMatch },
              { label: "오디언스", value: fit.audienceOverlap },
              { label: "스타일", value: fit.contentStyleFit },
            ].map((item) => {
              const fl = getFitLabel(item.value)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-muted-foreground">{item.label}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.value}% <span className={cn("font-medium", fl.color)}>{fl.label}</span>
                    </span>
                  </div>
                  <ProgressBar value={item.value} barColor={fl.barColor} />
                </div>
              )
            })}
            <div className="pt-2 border-t border-border">
              <p className="text-[11px] font-semibold text-foreground mb-1">AI 인사이트</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{fit.insight}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-foreground mb-1">추천 콘텐츠 방향</p>
              <ul className="space-y-1">
                {fit.suggestedAngles.map((angle, i) => (
                  <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                    <span className="text-primary shrink-0">•</span>
                    {angle}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-border mt-3 pt-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggleStats()
          }}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs font-semibold text-foreground">지원자 통계</span>
          {statsOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
        {statsOpen && (
          <div className="mt-2 space-y-2">
            <p className="text-[11px] text-muted-foreground">
              지원 {campaign.applicantCount}명 / 모집 {campaign.recruitCount}명
            </p>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  ratio >= 3 ? "bg-red-500" : ratio >= 1.5 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${Math.min(ratio / 4 * 100, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{ratio.toFixed(1)}:1</span>
              <span className={cn("text-[11px] font-medium", comp.color)}>경쟁률 {comp.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FitAnalysisInline({
  campaign,
  analysisState,
  onAnalyze,
}: {
  campaign: CampaignItem
  analysisState: AnalysisState
  onAnalyze: () => void
}) {
  const fit = campaign.fitAnalysis
  const ratio = campaign.applicantCount / campaign.recruitCount
  const comp = getCompetitionLabel(ratio)

  return (
    <div className="mt-3 pt-3 border-t border-border">
      {analysisState === "idle" && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAnalyze()
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3 h-3" />
            적합성 분석
          </button>
          <span className="text-[11px] text-muted-foreground">
            경쟁률 {ratio.toFixed(1)}:1
            <span className={cn("ml-1 font-medium", comp.color)}>({comp.label})</span>
          </span>
        </div>
      )}

      {analysisState === "loading" && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">AI 분석 중...</span>
          <span className="ml-auto text-[11px] text-muted-foreground">경쟁률 {ratio.toFixed(1)}:1</span>
        </div>
      )}

      {analysisState === "done" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground">적합성 {fit.overallScore}점</span>
            <span className={cn("text-xs font-medium", getFitLabel(fit.overallScore).color)}>
              {getFitLabel(fit.overallScore).label}
            </span>
            <span className="ml-auto text-[11px] text-muted-foreground">
              경쟁률 {ratio.toFixed(1)}:1
              <span className={cn("ml-1 font-medium", comp.color)}>({comp.label})</span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "카테고리", value: fit.categoryMatch },
              { label: "오디언스", value: fit.audienceOverlap },
              { label: "스타일", value: fit.contentStyleFit },
            ].map((item) => {
              const fl = getFitLabel(item.value)
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-muted-foreground">{item.label}</span>
                    <span className={cn("text-[10px] font-medium", fl.color)}>{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} barColor={fl.barColor} />
                </div>
              )
            })}
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{fit.insight}</p>
          <div className="flex flex-wrap gap-1.5">
            {fit.suggestedAngles.map((angle, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] text-foreground">
                {angle}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CampaignCard({
  campaign,
  isPriority,
}: {
  campaign: CampaignItem
  isPriority?: boolean
}) {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [statsOpen, setStatsOpen] = useState(true)

  const handleAnalyze = () => {
    setAnalysisState("loading")
    setTimeout(() => {
      setAnalysisState("done")
      setStatsOpen(false)
    }, 1500)
  }

  return (
    <Link
      href={`/explore/campaigns/${campaign.id}`}
      className="group flex flex-col sm:flex-row gap-4 md:gap-5 p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all"
    >
      <div className="relative w-full sm:w-[30%] shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-muted">
        <Image
          src={campaign.posterImageUrl}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 40vw, 30vw"
          priority={isPriority}
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-md">
          인플루언서 전용
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {campaign.advertiserLogoUrl && (
              <Image
                src={campaign.advertiserLogoUrl}
                alt=""
                width={20}
                height={20}
                className="rounded-full object-cover"
              />
            )}
            <span className="text-xs text-muted-foreground">{campaign.advertiserName}</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{campaign.summary}</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-accent/20 text-accent text-xs font-semibold">
              기본 {formatCurrency(campaign.baseFee)}
            </span>
            <span className="text-xs text-muted-foreground">
              + 조회당 {campaign.cpvRate}원 (최대 {formatCurrency(campaign.bonusCap)})
            </span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>마감 {campaign.applicationDeadline}</span>
            <span>모집 {campaign.recruitCount}명</span>
            <span>팔로워 {formatFollowers(campaign.minFollowers)}+</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {campaign.platforms.map((p) => (
              <span key={p} className="px-2 py-0.5 rounded bg-muted text-foreground text-xs">
                {p}
              </span>
            ))}
          </div>
          <div className="md:hidden">
            <FitAnalysisInline
              campaign={campaign}
              analysisState={analysisState}
              onAnalyze={handleAnalyze}
            />
          </div>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
            자세히 보기
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
      <div className="hidden md:flex md:w-[20%] shrink-0 flex-col border-l border-border pl-4">
        <FitAnalysisPanel
          campaign={campaign}
          analysisState={analysisState}
          onAnalyze={handleAnalyze}
          statsOpen={statsOpen}
          onToggleStats={() => setStatsOpen(!statsOpen)}
        />
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <div className="text-4xl mb-4">📢</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">진행 중인 캠페인이 없습니다</h3>
      <p className="text-muted-foreground text-center max-w-sm">곧 새로운 캠페인이 올라올 예정입니다.</p>
    </div>
  )
}

export default function ExploreCampaignsPage() {
  const [category, setCategory] = useState("전체")
  const filtered =
    category === "전체"
      ? CAMPAIGNS_DATA
      : CAMPAIGNS_DATA.filter((c) => c.category === category)

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">캠페인</h1>
          <p className="mt-2 text-muted-foreground">인플루언서를 위한 브랜드 콘텐츠 제작 캠페인</p>
        </div>
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
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
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="space-y-6" role="list">
              {filtered.map((campaign, index) => (
                <li key={campaign.id}>
                  <CampaignCard campaign={campaign} isPriority={index < 2} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
