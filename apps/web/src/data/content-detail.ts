/**
 * 콘텐츠 상세 페이지용 데이터 (향후 API 연동 시 교체)
 */

import { getInfluencerDetail } from "./influencer-detail"
import type { BlingContentItem, SecondaryCreationStatus, InfluencerDetailData } from "./influencer-detail"

export interface ExternalLink {
  platform: string
  url: string
}

export interface LicensePriceOption {
  duration: string
  price: number
  discountPrice?: number
  isRecommended?: boolean
}

export interface ContentDetailData extends BlingContentItem {
  influencerId: string
  influencerName: string
  influencerHandle: string
  influencerProfileImageUrl: string
  influencerCategory: string
  influencerFollowerSummary: string
  externalLinks?: ExternalLink[]
  /** 기간별 라이센싱 가격 (없으면 licensePrice 사용) */
  licensePrices?: LicensePriceOption[]
  /** 구매 전 유의사항 */
  precautions?: string[]
  /** 같은 크리에이터의 다른 콘텐츠 */
  creatorOtherContents?: BlingContentItem[]
}

const CONTENT_EXTENSIONS: Record<string, Partial<ContentDetailData>> = {
  c1: {
    description: "자연스러운 일상 속 뮤디 루틴을 담은 콘텐츠입니다. 제품 사용법과 팁을 자세히 설명합니다. 클렌징부터 수분크림까지 5분 완성 루틴을 함께해보세요. 피부 타입별 맞춤 추천과 시즈널 루틴 팁도 포함되어 있습니다.",
    externalLinks: [
      { platform: "Instagram", url: "https://instagram.com/beauty_kim" },
      { platform: "TikTok", url: "https://tiktok.com/@beauty_kim" },
    ],
    licensePrices: [
      { duration: "1개월", price: 200000 },
      { duration: "3개월", price: 350000, isRecommended: true },
      { duration: "6개월", price: 500000, discountPrice: 425000 },
      { duration: "영구", price: 0 },
    ],
    precautions: [
      "라이센싱 구매 후 해당 기간 동안 상업적 목적으로 사용 가능합니다.",
      "인플루언서가 설정한 2차 저작 허용 범위를 확인해주세요.",
      "사행성, 정치적 목적의 광고에는 사용이 제한될 수 있습니다.",
      "구매 취소는 결제 후 24시간 이내에만 가능합니다.",
    ],
  },
  c2: {
    licensePrices: [
      { duration: "1개월", price: 400000 },
      { duration: "3개월", price: 600000, isRecommended: true, discountPrice: 510000 },
      { duration: "6개월", price: 800000 },
    ],
    precautions: [
      "라이센싱 구매 후 해당 기간 동안 상업적 목적으로 사용 가능합니다.",
      "인플루언서가 설정한 2차 저작 허용 범위를 확인해주세요.",
    ],
  },
}

const DEFAULT_PRECAUTIONS = [
  "라이센싱 구매 후 해당 기간 동안 상업적 목적으로 사용 가능합니다.",
  "인플루언서가 설정한 2차 저작 허용 범위를 확인해주세요.",
  "사행성, 정치적 목적의 광고에는 사용이 제한될 수 있습니다.",
  "구매 취소는 결제 후 24시간 이내에만 가능합니다.",
]

const INFLUENCER_IDS = ["inf_1", "inf_2"]

export function getContentDetail(contentId: string): ContentDetailData | null {
  for (const infId of INFLUENCER_IDS) {
    const data = getInfluencerDetail(infId)
    if (!data) continue
    const content = data.blingContents.find((c) => c.id === contentId)
    if (content) {
      return mergeContentDetail(content, data, contentId)
    }
  }
  return null
}

function buildFollowerSummary(influencer: InfluencerDetailData): string {
  const followers = influencer.platformFollowers
  if (!followers || followers.length === 0) return ""
  // Use the largest follower range as summary
  return `${followers[0].range} 팔로워`
}

function mergeContentDetail(
  content: BlingContentItem,
  influencer: InfluencerDetailData,
  contentId: string
): ContentDetailData {
  const ext = CONTENT_EXTENSIONS[contentId] ?? {}
  const hasFixedPrice = content.licensePrice !== "협의" && typeof content.licensePrice === "number"

  return {
    ...content,
    influencerId: influencer.id,
    influencerName: influencer.name,
    influencerHandle: influencer.handle,
    influencerProfileImageUrl: influencer.profileImageUrl,
    influencerCategory: influencer.category,
    influencerFollowerSummary: buildFollowerSummary(influencer),
    externalLinks: ext.externalLinks ?? influencer.socialLinks.slice(0, 2).map((s) => ({
      platform: s.platform.charAt(0).toUpperCase() + s.platform.slice(1),
      url: s.url,
    })),
    licensePrices: ext.licensePrices ?? (hasFixedPrice ? [
      { duration: "1개월", price: content.licensePrice as number },
    ] : undefined),
    precautions: ext.precautions ?? DEFAULT_PRECAUTIONS,
    creatorOtherContents: influencer.blingContents.filter((c) => c.id !== contentId),
  }
}

export const SECONDARY_CREATION_LABELS: Record<SecondaryCreationStatus, string> = {
  1: "허용 안 함",
  2: "일부 허용",
  3: "자유 허용",
}
