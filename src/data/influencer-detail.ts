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

export interface BlingContentItem {
  id: string
  type: "video" | "image"
  thumbnailUrl: string
  videoUrl?: string // 영상일 때 재생용
  title: string
  description?: string
  /** 라이센스 가격 (숫자=원, "협의"=금액 협의 필요) */
  licensePrice: number | "협의"
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
  licensingVideo: LicensingOption
  licensingImage: LicensingOption
  secondaryCreation: LicensingOption
  blingContents: BlingContentItem[]
  secondaryContents: SecondaryContentItem[]
}

const DETAIL_DATA: Record<string, InfluencerDetailData> = {
  inf_1: {
    id: "inf_1",
    name: "김수민",
    handle: "@beautykim",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=450&fit=crop",
    category: "뷰티·스킨케어",
    socialLinks: [
      { platform: "youtube", url: "https://youtube.com/@beautykim" },
      { platform: "instagram", url: "https://instagram.com/beautykim" },
    ],
    platformFollowers: [
      { platform: "youtube", range: "50K~100K", url: "https://youtube.com/@beautykim" },
      { platform: "instagram", range: "80K~100K", url: "https://instagram.com/beautykim" },
    ],
    licensingVideo: 1,
    licensingImage: 1,
    secondaryCreation: 2,
    blingContents: [
      {
        id: "c1",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        title: "데일리 스킨케어 루틴",
        description: "아침 루틴 스킨케어 팁. 클렌징부터 수분크림까지 5분 완성.",
        licensePrice: 300000,
      },
      {
        id: "c2",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=600&fit=crop",
        title: "메이크업 컬렉션",
        description: "시즌 메이크업 룩북. 다양한 컬러 조합을 담았습니다.",
        licensePrice: 200000,
      },
      {
        id: "c3",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        title: "여름 립 메이크업",
        description: "물방울 글로시 립. 쿨톤 포인트 메이크업.",
        licensePrice: "협의",
      },
      {
        id: "c4",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
        title: "파우더 리뷰",
        description: "메쉬 파우더 3종 비교 리뷰.",
        licensePrice: 150000,
      },
      {
        id: "c5",
        type: "video",
        thumbnailUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        title: "세럼 비교",
        description: "바이탈 세럼 5종 핵심 비교.",
        licensePrice: 400000,
      },
      {
        id: "c6",
        type: "image",
        thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop",
        title: "클렌징 팁",
        description: "듀얼 클렌징 올바른 순서와 시간.",
        licensePrice: 180000,
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
    1: "모두 구매 가능",
    2: "일부 구매 가능",
    3: "불가",
  },
  image: {
    1: "모두 구매 가능",
    2: "일부 구매 가능",
    3: "불가",
  },
  secondary: {
    1: "허용 안 함",
    2: "컷편집 등 일부 허용",
    3: "자유롭게 허용",
  },
} as const
