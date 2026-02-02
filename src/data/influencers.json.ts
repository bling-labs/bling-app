/**
 * 하드코딩 인플루언서 데이터 (향후 API 연동 시 교체)
 */

export type PlatformType = "youtube" | "instagram" | "tiktok"

export interface ContentThumbnail {
  url: string
  title: string
}

export interface InfluencerItem {
  id: string
  name: string
  handle: string
  profileImageUrl: string
  coverImageUrl: string | null
  category: string
  socialConnected: boolean
  followerCount: number
  contentCount: number
  rating: number | null
  /** 소셜 플랫폼 (3개 초과 시 +N 표시) */
  platforms?: PlatformType[]
  /** 소개 문구 */
  bio?: string
  /** 콘텐츠 썸네일 (캐러셀용, 최소 2개 권장) */
  contentThumbnails?: ContentThumbnail[]
}

function formatFollower(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${Math.round(count / 1000)}K`
  return String(count)
}

/** 팔로워를 범위 형식으로 (200K-500K), 나오지 않을 수도 있음 */
export function formatFollowerRange(count: number): string | null {
  if (count <= 0) return null
  if (count >= 1000000) return `1M-${(count / 1000000).toFixed(1)}M`
  if (count >= 500000) return "500K-1M"
  if (count >= 100000) return "100K-500K"
  if (count >= 50000) return "50K-100K"
  if (count >= 10000) return "10K-50K"
  if (count >= 1000) return "1K-10K"
  return "~1K"
}

const SAMPLE_CONTENTS: Record<string, ContentThumbnail[]> = {
  food: [
    { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop", title: "5분 완성 파스타 레시피" },
    { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop", title: "홈메이드 피자 만들기" },
  ],
  beauty: [
    { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=600&fit=crop", title: "데일리 스킨케어 루틴" },
    { url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=600&fit=crop", title: "메이크업 컬렉션" },
  ],
  fitness: [
    { url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop", title: "10분 홈트 루틴" },
    { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=600&fit=crop", title: "스트레칭 기초" },
  ],
  default: [
    { url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop", title: "콘텐츠" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=600&fit=crop", title: "영상" },
  ],
}

function getContentThumbnails(category: string): ContentThumbnail[] {
  const key = category.includes("푸드") || category.includes("맛집") ? "food"
    : category.includes("뷰티") || category.includes("스킨") ? "beauty"
    : category.includes("피트니스") || category.includes("헬스") ? "fitness"
    : "default"
  return SAMPLE_CONTENTS[key] ?? SAMPLE_CONTENTS.default
}

export const INFLUENCERS_DATA: InfluencerItem[] = [
  {
    id: "inf_1",
    name: "김수민",
    handle: "@beautykim",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    category: "뷰티·스킨케어",
    socialConnected: true,
    followerCount: 85000,
    contentCount: 124,
    rating: 4.9,
    platforms: ["youtube", "instagram"],
    bio: "스킨케어와 메이크업 팁을 공유합니다. 자연스러운 뷰티로 당신을 빛나게!",
    contentThumbnails: getContentThumbnails("뷰티·스킨케어"),
  },
  {
    id: "inf_2",
    name: "박준호",
    handle: "@fitjohn",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    category: "피트니스·헬스",
    socialConnected: true,
    followerCount: 92000,
    contentCount: 98,
    rating: 4.8,
    platforms: ["instagram", "tiktok"],
    bio: "바쁜 직장인을 위한 홈트 레시피. 10분이면 충분해요.",
    contentThumbnails: getContentThumbnails("피트니스"),
  },
  {
    id: "inf_3",
    name: "이지은",
    handle: "@daily_vibe",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    category: "라이프스타일",
    socialConnected: true,
    followerCount: 156000,
    contentCount: 203,
    rating: 5.0,
    platforms: ["youtube", "instagram", "tiktok"],
    bio: "일상의 작은 순간들을 담습니다. 따뜻한 라이프스타일 콘텐츠.",
    contentThumbnails: getContentThumbnails("라이프스타일"),
  },
  {
    id: "inf_4",
    name: "최민재",
    handle: "@style_log",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    category: "패션·스타일",
    socialConnected: true,
    followerCount: 67000,
    contentCount: 87,
    rating: 4.7,
    platforms: ["instagram", "youtube"],
    bio: "캐주얼부터 포멀까지. 나만의 스타일을 찾아보세요.",
    contentThumbnails: getContentThumbnails("패션"),
  },
  {
    id: "inf_5",
    name: "푸드마스터",
    handle: "@food_master",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    category: "푸드·맛집",
    socialConnected: true,
    followerCount: 312000,
    contentCount: 156,
    rating: 4.9,
    platforms: ["youtube", "instagram", "tiktok", "youtube", "instagram"],
    bio: "누구나 쉽게 따라할 수 있는 레시피를 공유합니다. 맛있는 요리로 행복한 식탁을!",
    contentThumbnails: [
      { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=600&fit=crop", title: "5분 완성 파스타 레시피" },
      { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=600&fit=crop", title: "홈메이드 피자 만들기" },
    ],
  },
  {
    id: "inf_6",
    name: "한서준",
    handle: "@travellee",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
    category: "여행·VLOG",
    socialConnected: false,
    followerCount: 0,
    contentCount: 42,
    rating: null,
    bio: "여행 영상 전문 크리에이터.",
    contentThumbnails: getContentThumbnails("여행"),
  },
  {
    id: "inf_7",
    name: "윤아름",
    handle: "@tech_review",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400&h=300&fit=crop",
    category: "테크·리뷰",
    socialConnected: true,
    followerCount: 45000,
    contentCount: 78,
    rating: 4.6,
    platforms: ["youtube", "instagram"],
    bio: "IT 기기 리뷰와 활용 팁을 공유합니다.",
    contentThumbnails: getContentThumbnails("테크"),
  },
  {
    id: "inf_8",
    name: "임동현",
    handle: "@gamer_zone",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
    coverImageUrl: null,
    category: "게임",
    socialConnected: false,
    followerCount: 0,
    contentCount: 65,
    rating: null,
    bio: "게임 플레이 영상과 공략 콘텐츠.",
    contentThumbnails: getContentThumbnails("게임"),
  },
  {
    id: "inf_9",
    name: "송민지",
    handle: "@music_daily",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop",
    category: "음악",
    socialConnected: true,
    followerCount: 230000,
    contentCount: 112,
    rating: 5.0,
    platforms: ["youtube", "tiktok"],
    bio: "음악 커버와 오리지널 작곡을 올립니다.",
    contentThumbnails: getContentThumbnails("음악"),
  },
  {
    id: "inf_10",
    name: "강지훈",
    handle: "@skincare_routine",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
    category: "뷰티",
    socialConnected: true,
    followerCount: 32000,
    contentCount: 89,
    rating: 4.5,
    platforms: ["instagram"],
    bio: "민감성 피부를 위한 스킨케어 가이드.",
    contentThumbnails: getContentThumbnails("뷰티"),
  },
  {
    id: "inf_11",
    name: "오수빈",
    handle: "@home_chef",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    category: "푸드",
    socialConnected: false,
    followerCount: 0,
    contentCount: 34,
    rating: null,
    bio: "집에서 만드는 간단 요리 레시피.",
    contentThumbnails: getContentThumbnails("푸드"),
  },
  {
    id: "inf_12",
    name: "홍재민",
    handle: "@fitness_life",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    category: "피트니스",
    socialConnected: true,
    followerCount: 78000,
    contentCount: 145,
    rating: 4.8,
    platforms: ["youtube", "instagram", "tiktok"],
    bio: "헬스와 식단 관리 꿀팁.",
    contentThumbnails: getContentThumbnails("피트니스"),
  },
]

export { formatFollower }
