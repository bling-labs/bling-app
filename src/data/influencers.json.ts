/**
 * 하드코딩 인플루언서 데이터 (향후 API 연동 시 교체)
 */

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
}

function formatFollower(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${Math.round(count / 1000)}K`
  return String(count)
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
  },
  {
    id: "inf_5",
    name: "정다혜",
    handle: "@foodpark",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    category: "푸드·맛집",
    socialConnected: true,
    followerCount: 120000,
    contentCount: 156,
    rating: 4.9,
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
  },
]

export { formatFollower }
