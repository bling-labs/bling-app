/**
 * 하드코딩 콘텐츠 데이터 (향후 API 연동 시 교체)
 */

export interface ContentCreator {
  id: string
  nickname: string
  profileImageUrl: string
  socialConnected: boolean
  followerRange?: { min: number; max: number }
}

export interface ContentItem {
  id: string
  thumbnailUrl: string
  category: string
  priceRange: { min: number; max: number }
  creator: ContentCreator
  tags: string[]
}

function formatPriceRange(min: number, max: number): string {
  const format = (n: number) => (n >= 1000000 ? `₩${n / 1000000}M` : `₩${Math.round(n / 1000)}K`)
  return min === max ? format(min) : `${format(min)}-${format(max)}`
}

function getFollowerRangeLabel(min: number, max: number): string {
  if (max < 10000) return "~10K"
  if (max < 50000) return "10K-50K"
  if (max < 100000) return "50K-100K"
  if (max < 500000) return "100K-500K"
  return "500K+"
}

export const CONTENTS_DATA: ContentItem[] = [
  {
    id: "content_1",
    thumbnailUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=712&fit=crop",
    category: "뷰티",
    priceRange: { min: 200000, max: 500000 },
    creator: {
      id: "creator_1",
      nickname: "@beautykim",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 10000, max: 50000 },
    },
    tags: ["뷰티", "스킨케어", "루틴"],
  },
  {
    id: "content_2",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=712&fit=crop",
    category: "피트니스",
    priceRange: { min: 280000, max: 280000 },
    creator: {
      id: "creator_2",
      nickname: "@fitjohn",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 50000, max: 100000 },
    },
    tags: ["피트니스", "홈트"],
  },
  {
    id: "content_3",
    thumbnailUrl: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=712&fit=crop",
    category: "푸드",
    priceRange: { min: 350000, max: 420000 },
    creator: {
      id: "creator_3",
      nickname: "@foodpark",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 100000, max: 500000 },
    },
    tags: ["푸드", "맛집"],
  },
  {
    id: "content_4",
    thumbnailUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=712&fit=crop",
    category: "여행",
    priceRange: { min: 530000, max: 530000 },
    creator: {
      id: "creator_4",
      nickname: "@travellee",
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
      socialConnected: false,
    },
    tags: ["여행", "VLOG"],
  },
  {
    id: "content_5",
    thumbnailUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=712&fit=crop",
    category: "패션",
    priceRange: { min: 180000, max: 320000 },
    creator: {
      id: "creator_5",
      nickname: "@style_log",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 0, max: 10000 },
    },
    tags: ["패션", "스타일"],
  },
  {
    id: "content_6",
    thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=712&fit=crop",
    category: "라이프스타일",
    priceRange: { min: 250000, max: 400000 },
    creator: {
      id: "creator_6",
      nickname: "@daily_vibe",
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 50000, max: 100000 },
    },
    tags: ["라이프스타일", "데일리"],
  },
  {
    id: "content_7",
    thumbnailUrl: "https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=400&h=712&fit=crop",
    category: "테크",
    priceRange: { min: 300000, max: 450000 },
    creator: {
      id: "creator_7",
      nickname: "@tech_review",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 100000, max: 500000 },
    },
    tags: ["테크", "리뷰"],
  },
  {
    id: "content_8",
    thumbnailUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=712&fit=crop",
    category: "게임",
    priceRange: { min: 150000, max: 280000 },
    creator: {
      id: "creator_8",
      nickname: "@gamer_zone",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop",
      socialConnected: false,
    },
    tags: ["게임", "플레이"],
  },
  {
    id: "content_9",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=712&fit=crop",
    category: "음악",
    priceRange: { min: 220000, max: 380000 },
    creator: {
      id: "creator_9",
      nickname: "@music_daily",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop",
      socialConnected: true,
      followerRange: { min: 10000, max: 50000 },
    },
    tags: ["음악", "커버"],
  },
]

export { formatPriceRange, getFollowerRangeLabel }
