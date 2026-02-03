/**
 * 컨테스트 목록용 모킹 데이터 (향후 API 연동 시 교체)
 */

export interface ContestItem {
  id: string
  /** 포스터 이미지 URL */
  posterImageUrl: string
  /** 타이틀 */
  title: string
  /** 내용 본문 또는 요약 (목록에서는 요약으로 사용) */
  summary: string
  /** 접수일정 (표시용 문자열) */
  applicationPeriod: string
  /** 발표일정 (표시용 문자열) */
  announcementDate: string
  /** 콘텐츠 유형, 초기에는 '숏폼' 고정 */
  contentType: string
  /** 지원자격 */
  eligibility: string

  type: "창작" | "창작&홍보" 
}

export const CONTESTS_DATA: ContestItem[] = [
  {
    id: "contest_1",
    posterImageUrl:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=560&h=420&fit=crop",
    title: "블링엔터테인먼트 가수 뉴진스 홍보 바이럴 영상 제작",
    summary:
      "필수 해시태그 #NEWJEANS #뉴진스 포함. 출품은 제작 영상을 자신의 SNS 게시 후 SNS 링크를 전달해주시면 됩니다.",
    applicationPeriod: "2026.01.01 ~ 2026.01.31",
    announcementDate: "2026.02.15",
    contentType: "숏폼",
    type: "창작",
    eligibility: "팔로워 수 1000명 이상 크리에이터",
  },
  {
    id: "contest_2",
    posterImageUrl:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=560&h=420&fit=crop",
    title: "2026 브랜드 숏폼 UGC 공모전",
    summary:
      "브랜드 콘셉트에 맞는 창의적인 숏폼 영상을 제작해 주세요. 틱톡, 인스타 릴스, 유튜브 쇼츠 중 선택 가능합니다.",
    applicationPeriod: "2026.02.01 ~ 2026.02.28",
    announcementDate: "2026.03.10",
    contentType: "숏폼",
    eligibility: "블링 가입 회원 누구나",
  },
]
