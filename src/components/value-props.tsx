"use client"

import { ArrowRight, Check, Briefcase, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

const advertiserBenefits = [
  "10,000개 이상의 트렌디한 숏폼 콘텐츠",
  "숏폼 영상 + 이미지 라이센싱",
  "명확한 라이센스 계약",
  "고화질 원본 파일 다운로드",
  "2차 저작 가이드라인 제공",
  "빠른 검색 및 필터링",
]

const influencerBenefits = [
  "기존 콘텐츠를 재활용",
  "숏폼 영상 + 이미지 동시 판매",
  "한 번 업로드로 지속 수익",
  "투명한 정산 시스템",
  "콘텐츠 가격 직접 설정",
  "SNS 계정 간편 연동",
]

export function ValueProps() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Advertiser Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group hover:border-primary/40 transition-all">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 mb-6">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-foreground mb-2">
              광고주를 위한 솔루션
            </h3>
            <p className="text-muted-foreground mb-6">
              검증된 콘텐츠로 광고 성과를 극대화하세요
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {advertiserBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group/btn">
              콘텐츠 둘러보기
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Influencer Card */}
          <div className="relative p-8 rounded-3xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 group hover:border-secondary/40 transition-all">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary/20 mb-6">
              <Palette className="w-6 h-6 text-secondary" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-foreground mb-2">
              인플루언서를 위한 기회
            </h3>
            <p className="text-muted-foreground mb-6">
              내 콘텐츠로 지속 수익을 만드세요
            </p>

            {/* Benefits */}
            <ul className="space-y-3 mb-8">
              {influencerBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground group/btn">
              수익 시뮬레이터
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
