"use client"

import { useState } from "react"
import {
  RefreshCw,
  Search,
  FileCheck,
  Download,
  UserPlus,
  Upload,
  Settings,
  Wallet,
} from "lucide-react"

const advertiserSteps = [
  {
    icon: RefreshCw,
    title: "구글 로그인 및 서비스 연동",
    description: "구글 계정 + 소셜 계정 빠르게 연동하여 손쉽게 시작합니다.",
    color: "secondary",
  },
  {
    icon: Search,
    title: "콘텐츠 탐색 및 큐레이션",
    description: "원하신 성격, 필요 숏폼을 성별 카테고리 컨텐츠를 검색해 찾습니다.",
    color: "secondary",
  },
  {
    icon: FileCheck,
    title: "라이센스 구매 및 2차 저작",
    description: "선택한 영상의 저작권 라이센스 구매하고 2차저작 라이센스 권한을 가져갑니다.",
    color: "secondary",
  },
  {
    icon: Download,
    title: "최종 광고 크리에이티브 다운로드",
    description: "최상의 퀄리티 광고 크리에이티브로 광고 러닝으로 바로 활용하시면 됩니다.",
    color: "accent",
  },
]

const influencerSteps = [
  {
    icon: UserPlus,
    title: "크리에이터 등록",
    description: "포트폴리오 프로필을 생성하고 나만의 브랜드를 구축하세요.",
    color: "secondary",
  },
  {
    icon: Upload,
    title: "콘텐츠 업로드",
    description: "기존 SNS 연동 또는 직접 업로드로 콘텐츠를 등록하세요.",
    color: "secondary",
  },
  {
    icon: Settings,
    title: "가격 설정 & 라이센스",
    description: "독점/비독점 조건과 가격을 직접 설정하세요.",
    color: "secondary",
  },
  {
    icon: Wallet,
    title: "수익 정산",
    description: "투명한 정산 시스템으로 안정적인 수익을 받으세요.",
    color: "accent",
  },
]

export function ProcessSection() {
  const [activeTab, setActiveTab] = useState<"advertiser" | "influencer">("advertiser")

  const steps = activeTab === "advertiser" ? advertiserSteps : influencerSteps

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            어떻게 운영되나요?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            캠페인 시작부터 정산까지, 가장 효율적인 4단계 프로세스
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-muted rounded-xl">
            <button
              onClick={() => setActiveTab("advertiser")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === "advertiser"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              광고주
            </button>
            <button
              onClick={() => setActiveTab("influencer")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === "influencer"
                  ? "bg-secondary text-secondary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              인플루언서
            </button>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-secondary to-accent" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isLast = index === steps.length - 1
              const colorClass = step.color === "accent" ? "bg-accent" : "bg-secondary"
              const textColor = step.color === "accent" ? "text-accent" : "text-secondary"

              return (
                <div key={index} className="relative flex gap-6 group">
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${colorClass} shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="p-6 rounded-2xl bg-card border border-border group-hover:border-secondary/30 transition-all">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold ${textColor}`}>
                          STEP {index + 1}
                        </span>
                        {isLast && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-accent/20 text-accent rounded-full">
                            완료
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
