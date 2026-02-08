/**
 * 하드코딩 알림 데이터 (추후 API 연동 시 교체)
 */
export interface NotificationItem {
  id: string
  type: "licensing" | "campaign" | "approval" | "settlement" | "notice"
  title: string
  description: string
  timeAgo: string
  unread: boolean
}

export const NOTIFICATIONS_MOCK: NotificationItem[] = [
  {
    id: "1",
    type: "licensing",
    title: "새로운 라이센싱 요청",
    description: "ABC 브랜드에서 '여름 스킨케어 루틴' 콘텐츠의 라이센싱을 요청했습니다.",
    timeAgo: "10분 전",
    unread: true,
  },
  {
    id: "2",
    type: "campaign",
    title: "캠페인 선정 안내",
    description: "'신제품 런칭 캠페인'에 선정되었습니다. 상세 내용을 확인해주세요.",
    timeAgo: "1시간 전",
    unread: true,
  },
  {
    id: "3",
    type: "approval",
    title: "콘텐츠 승인 완료",
    description: "'데일리 메이크업 GRWM' 콘텐츠가 승인되었습니다.",
    timeAgo: "3시간 전",
    unread: false,
  },
  {
    id: "4",
    type: "settlement",
    title: "수익 정산 완료",
    description: "1월 수익 350,000원이 정산 완료되었습니다.",
    timeAgo: "1일 전",
    unread: false,
  },
  {
    id: "5",
    type: "notice",
    title: "서비스 업데이트 안내",
    description: "Bling 서비스가 업데이트되었습니다. 새로운 기능을 확인해보세요.",
    timeAgo: "2일 전",
    unread: false,
  },
]

export function getUnreadCount(): number {
  return NOTIFICATIONS_MOCK.filter((n) => n.unread).length
}
