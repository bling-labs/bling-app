/**
 * 인플루언서 상세 페이지용 확장 데이터 (향후 API 연동 시 교체)
 */

// 라이센싱 옵션: 1=모두/허용X, 2=일부/일부허용, 3=불가/자유허용
export type LicensingOption = 1 | 2 | 3

export interface PlatformFollower {
  platform: "youtube" | "instagram" | "tiktok"
  range: string // "1K~5.1M" 형식
  url?: string
}

export interface SocialLink {
  platform: "youtube" | "instagram" | "tiktok"
  url: string
}

/** 2차저작: 1=불가, 2=일부, 3=자유 */
export type SecondaryCreationStatus = 1 | 2 | 3

export interface BlingContentItem {
  id: string
  type: "video" | "image"
  thumbnailUrl: string
  videoUrl?: string // 영상일 때 재생용
  title: string
  description?: string
  /** 라이센스 가격 (숫자=원, "협의"=금액 협의 필요) */
  licensePrice: number | "협의"
  viewCount?: number
  /** 2차저작 허용: 1=불가, 2=일부, 3=자유 */
  secondaryCreation?: SecondaryCreationStatus
}

export interface LicensingRule {
  text: string
  prohibited: boolean // true=불가(빨강X), false=가능(초록체크)
}

export interface CollaborationNotes {
  productionDays?: string
  revisionCount?: string
  originalFileProvision?: string
}

export interface SecondaryContentItem {
  id: string
  thumbnailUrl: string
  title: string
  advertiserReview?: {
    profileImageUrl: string
    nickname: string
    companyName?: string
    content: string
  }
}

export interface InfluencerDetailData {
  id: string
  name: string
  handle: string
  profileImageUrl: string
  coverImageUrl: string | null
  category: string
  socialLinks: SocialLink[]
  platformFollowers: PlatformFollower[]
  /** 2차저작 허용: 1=허용X, 2=일부, 3=자유 (영상) */
  licensingVideo: LicensingOption
  /** 2차저작 허용: 1=허용X, 2=일부, 3=자유 (이미지) */
  licensingImage: LicensingOption
  secondaryCreation: LicensingOption
  /** 인플루언서 소개 (긴 글) */
  bio?: string
  /** 협업 시 참고사항 */
  collaborationNotes?: CollaborationNotes
  /** 라이센싱 규칙 (플랫폼 제공, 인플루언서 체크) */
  licensingRules?: LicensingRule[]
  blingContents: BlingContentItem[]
  secondaryContents: SecondaryContentItem[]
}

const DETAIL_DATA: Record<string, InfluencerDetailData> = {
  inf_1: {
    id: "inf_1",
    name: "김뷰티",
    handle: "@beauty_kim",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=450&fit=crop",
    category: "뷰티·스킨케어",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/beauty_kim" },
      { platform: "youtube", url: "https://youtube.com/@beauty_kim" },
      { platform: "tiktok", url: "https://tiktok.com/@beauty_kim" },
    ],
    platformFollowers: [
      { platform: "instagram", range: "245K", url: "https://instagram.com/beauty_kim" },
      { platform: "youtube", range: "180K", url: "https://youtube.com/@beauty_kim" },
      { platform: "tiktok", range: "320K", url: "https://tiktok.com/@beauty_kim" },
    ],
    licensingVideo: 2,
    licensingImage: 3,
    secondaryCreation: 2,
    bio: "자연스러운 뷰티 콘텐츠로 일상 속 아름다움을 전합니다. 10년차 뷰티 크리에이터로 스킨케어부터 메이크업, 헤어까지 다양한 뷰티 팁을 공유하고 있어요.\n\n5년간 뷰티 업계에서 다양한 브랜드와 협업해왔으며, 실용적인 뷰티 팁과 제품 리뷰에 강점이 있습니다. 광고주가 원하는 자연스러운 제품 노출과 퀄리티 높은 콘텐츠 제작을 지향합니다. 협업 문의는 언제나 환영합니다.",
    collaborationNotes: {
      productionDays: "약 5-7일",
      revisionCount: "2회까지 무료",
      originalFileProvision: "가능",
    },
    licensingRules: [
      { text: "사행성 광고에 사용 불가", prohibited: true },
      { text: "다른 인플루언서 콘텐츠와 혼합한 2차저작 불가", prohibited: true },
      { text: "정치적 목적의 광고에 사용 불가", prohibited: true },
      { text: "브랜드 로고 삽입 가능", prohibited: false },
      { text: "자막 추가 가능", prohibited: false },
    ],
    blingContents: [
      {
        id: "c1",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "모닝 스킨케어 루틴 - 촉촉한 피부를 위한 5단계",
        description: "아침 루틴 스킨케어 팁. 클렌징부터 수분크림까지 5분 완성.",
        licensePrice: 350000,
        viewCount: 52000,
        secondaryCreation: 3,
      },
      {
        id: "c2",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop",
        title: "여름 메이크업 튜토리얼",
        description: "시즌 메이크업 룩북. 다양한 컬러 조합을 담았습니다.",
        licensePrice: 400000,
        viewCount: 48000,
        secondaryCreation: 2,
      },
      {
        id: "c3",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop",
        title: "클렌징 루틴 완벽 가이드",
        description: "듀얼 클렌징 올바른 순서와 시간.",
        licensePrice: 280000,
        viewCount: 35000,
        secondaryCreation: 3,
      },
      {
        id: "c4",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop",
        title: "립 제품 솔직 리뷰",
        description: "립 제품 솔직 리뷰.",
        licensePrice: 200000,
        viewCount: 28000,
        secondaryCreation: 1,
      },
      {
        id: "c5",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        title: "나이트 케어 루틴",
        description: "바이탈 세럼 5종 핵심 비교.",
        licensePrice: 320000,
        viewCount: 41000,
        secondaryCreation: 2,
      },
      {
        id: "c6",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop",
        title: "아이 메이크업",
        description: "아이 메이크업 팁.",
        licensePrice: 380000,
        viewCount: 36000,
        secondaryCreation: 3,
      },
    ],
    secondaryContents: [
      {
        id: "s1",
        thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
        title: "A브랜드 스킨케어 광고",
        advertiserReview: {
          profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
          nickname: "마케터김",
          companyName: "(주)에이뷰티",
          content: "자연스러운 톤과 높은 퀄리티로 브랜드 이미지에 잘 맞았습니다. 협업이 매우 수월했어요.",
        },
      },
    ],
  },
  inf_2: {
    id: "inf_2",
    name: "박준호",
    handle: "@fitjohn",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
    category: "피트니스·헬스",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/fitjohn" },
      { platform: "tiktok", url: "https://tiktok.com/@fitjohn" },
    ],
    platformFollowers: [
      { platform: "instagram", range: "90K~100K" },
      { platform: "tiktok", range: "50K~100K" },
    ],
    licensingVideo: 2,
    licensingImage: 1,
    secondaryCreation: 3,
    blingContents: [
      {
        id: "c7",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "홈트 10분 루틴",
        description: "바쁜 아침, 10분 홈트레이닝으로 기상 활성화.",
        licensePrice: 250000,
      },
      {
        id: "c8",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        title: "스트레칭 기초",
        description: "운동 전후 필수 스트레칭 5동작.",
        licensePrice: "협의",
      },
      {
        id: "c9",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop",
        title: "식단 관리 팁",
        description: "프로틴 밀크쉐이크 레시피.",
        licensePrice: 120000,
      },
    ],
    secondaryContents: [],
  },
}

import { INFLUENCERS_DATA } from "./influencers.json"

function formatFollowerRange(count: number): string {
  if (count >= 1000000) return `1M~${(count / 1000000).toFixed(1)}M`
  if (count >= 100000) return "100K~500K"
  if (count >= 50000) return "50K~100K"
  if (count >= 10000) return "10K~50K"
  if (count >= 1000) return "1K~10K"
  return "~1K"
}

function buildFallbackDetail(id: string): InfluencerDetailData | null {
  const base = INFLUENCERS_DATA.find((i) => i.id === id)
  if (!base) return null
  const platforms: ("youtube" | "instagram" | "tiktok")[] = base.socialConnected
    ? ["instagram", "youtube"]
    : []
  return {
    id: base.id,
    name: base.name,
    handle: base.handle,
    profileImageUrl: base.profileImageUrl,
    coverImageUrl: base.coverImageUrl,
    category: base.category,
    socialLinks: platforms.map((p) => ({ platform: p, url: "#" })),
    platformFollowers: base.socialConnected
      ? platforms.map((p) => ({ platform: p, range: formatFollowerRange(base.followerCount) }))
      : [],
    licensingVideo: 1,
    licensingImage: 1,
    secondaryCreation: 2,
    blingContents: [],
    secondaryContents: [],
  }
}

export function getInfluencerDetail(id: string): InfluencerDetailData | null {
  return DETAIL_DATA[id] ?? buildFallbackDetail(id)
}

export const LICENSING_LABELS = {
  video: {
    1: "허용 안 함",
    2: "일부 허용",
    3: "자유 허용",
  },
  image: {
    1: "허용 안 함",
    2: "일부 허용",
    3: "자유 허용",
  },
  secondary: {
    1: "허용 안 함",
    2: "컷편집 등 일부 허용",
    3: "자유롭게 허용",
  },
} as const

export const SECONDARY_CREATION_LABELS: Record<1 | 2 | 3, string> = {
  1: "2차저작 불가",
  2: "2차저작 일부",
  3: "2차저작 자유",
}
