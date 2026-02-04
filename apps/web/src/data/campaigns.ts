/**
 * 캠페인 목록용 모킹 데이터 (향후 API 연동 시 교체)
 */

export type PlatformRequirement = "유튜브 쇼츠" | "인스타그램 릴스" | "틱톡"

export type CampaignStatus = "모집중" | "심사중" | "제작중" | "완료"

export interface FitAnalysis {
  categoryMatch: number
  audienceOverlap: number
  contentStyleFit: number
  overallScore: number
  insight: string
  suggestedAngles: string[]
}

export interface CampaignItem {
  id: string
  posterImageUrl: string
  title: string
  summary: string
  advertiserName: string
  advertiserLogoUrl?: string
  status: CampaignStatus
  contentType: string
  platforms: PlatformRequirement[]
  recruitCount: number
  applicantCount: number
  minFollowers: number
  baseFee: number
  cpvRate: number
  bonusCap: number
  applicationDeadline: string
  productionDeadline: string
  postingDeadline: string
  category: string
  fitAnalysis: FitAnalysis
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000 && amount % 10000 === 0) {
    return `${amount / 10000}만원`
  }
  return `${amount.toLocaleString("ko-KR")}원`
}

export function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`
  return count.toString()
}

export function getCompetitionLabel(ratio: number): {
  label: string
  color: string
} {
  if (ratio >= 3) return { label: "치열", color: "text-red-500" }
  if (ratio >= 1.5) return { label: "보통", color: "text-yellow-500" }
  return { label: "여유", color: "text-green-500" }
}

export function getFitLabel(score: number): {
  label: string
  color: string
  barColor: string
} {
  if (score >= 80) return { label: "높음", color: "text-green-500", barColor: "bg-green-500" }
  if (score >= 50) return { label: "보통", color: "text-yellow-500", barColor: "bg-yellow-500" }
  return { label: "낮음", color: "text-red-500", barColor: "bg-red-500" }
}

export const CAMPAIGNS_DATA: CampaignItem[] = [
  {
    id: "camp_1",
    posterImageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=560&h=420&fit=crop",
    title: "글로벌 스킨케어 브랜드 신제품 런칭 캠페인",
    summary:
      "글로벌 스킨케어 브랜드 A사의 신제품 런칭을 위한 숏폼 콘텐츠를 제작해주세요. 제품 사용 후기 및 자연스러운 일상 속 사용 장면을 담아주시면 됩니다.",
    advertiserName: "(주)에이뷰티코리아",
    advertiserLogoUrl:
      "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop",
    status: "모집중",
    contentType: "숏폼",
    platforms: ["인스타그램 릴스", "틱톡"],
    recruitCount: 5,
    applicantCount: 12,
    minFollowers: 1000,
    baseFee: 500000,
    cpvRate: 5,
    bonusCap: 2000000,
    applicationDeadline: "2026.02.28",
    productionDeadline: "2026.03.15",
    postingDeadline: "2026.03.20",
    category: "뷰티",
    fitAnalysis: {
      categoryMatch: 92,
      audienceOverlap: 78,
      contentStyleFit: 85,
      overallScore: 85,
      insight:
        "뷰티 카테고리에서 높은 적합도를 보이며, 특히 스킨케어 리뷰 콘텐츠 경험이 강점입니다. 타겟 20~30대 여성층과 오디언스 겹침도가 양호합니다.",
      suggestedAngles: [
        "일상 속 자연스러운 제품 사용 브이로그",
        "Before/After 비교 숏폼",
        "모닝/나이트 루틴에 자연스럽게 녹여내기",
      ],
    },
  },
  {
    id: "camp_2",
    posterImageUrl:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=560&h=420&fit=crop",
    title: "프리미엄 홈트레이닝 앱 체험 캠페인",
    summary:
      "홈트레이닝 앱 '핏투데이'의 프리미엄 프로그램 체험 후기를 숏폼 영상으로 제작해주세요. 실제 운동 장면과 효과를 자연스럽게 보여주시면 됩니다.",
    advertiserName: "(주)핏투데이",
    advertiserLogoUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=64&h=64&fit=crop",
    status: "모집중",
    contentType: "숏폼",
    platforms: ["유튜브 쇼츠", "인스타그램 릴스", "틱톡"],
    recruitCount: 8,
    applicantCount: 23,
    minFollowers: 5000,
    baseFee: 800000,
    cpvRate: 3,
    bonusCap: 1500000,
    applicationDeadline: "2026.03.10",
    productionDeadline: "2026.03.25",
    postingDeadline: "2026.03.31",
    category: "피트니스",
    fitAnalysis: {
      categoryMatch: 45,
      audienceOverlap: 62,
      contentStyleFit: 58,
      overallScore: 55,
      insight:
        "피트니스 카테고리와의 직접적인 매칭도는 보통이나, 라이프스타일 콘텐츠와의 접점이 있습니다. 건강/웰빙에 관심 있는 오디언스를 보유하고 있다면 충분히 도전해볼 만합니다.",
      suggestedAngles: [
        "일상 속 틈새 운동 챌린지",
        "앱 사용 전후 변화 기록 브이로그",
      ],
    },
  },
  {
    id: "camp_3",
    posterImageUrl:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=560&h=420&fit=crop",
    title: "신규 비건 레스토랑 오픈 홍보 캠페인",
    summary:
      "강남에 새로 오픈하는 비건 레스토랑 '그린테이블'의 메뉴 체험 영상을 제작해주세요. 맛있는 비건 음식의 매력을 담아주시면 됩니다.",
    advertiserName: "(주)그린테이블",
    status: "모집중",
    contentType: "숏폼",
    platforms: ["인스타그램 릴스", "틱톡"],
    recruitCount: 3,
    applicantCount: 7,
    minFollowers: 3000,
    baseFee: 300000,
    cpvRate: 4,
    bonusCap: 1000000,
    applicationDeadline: "2026.02.20",
    productionDeadline: "2026.03.05",
    postingDeadline: "2026.03.10",
    category: "푸드",
    fitAnalysis: {
      categoryMatch: 88,
      audienceOverlap: 91,
      contentStyleFit: 82,
      overallScore: 87,
      insight:
        "푸드 카테고리에서 매우 높은 적합도를 보입니다. 맛집 리뷰 콘텐츠 경험과 시각적 연출력이 돋보이며, 건강/비건에 관심 있는 팔로워층과의 시너지가 기대됩니다.",
      suggestedAngles: [
        "비건 음식도 이렇게 맛있다! 반전 먹방",
        "셰프 인터뷰 + 메뉴 소개 숏폼",
        "친구와 함께하는 비건 맛집 탐방기",
      ],
    },
  },
]
