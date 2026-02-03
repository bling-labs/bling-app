/**
 * 컨테스트 상세 페이지용 데이터 (향후 API 연동 시 교체)
 */

import type { ContestItem } from "./contests"
import { CONTESTS_DATA } from "./contests"

export interface ContestFaqItem {
  question: string
  answer: string
}

export interface ContestDetailData extends ContestItem {
  /** 본문 전체 (해시태그·출품방법·필수사항 등) */
  content: string
  /** 상금 외 혜택 (텍스트) */
  benefits?: string
  /** 게시될 플랫폼 (복수) */
  platforms?: string[]
  /** 지원조건 상세 (목록 eligibility와 동일해도 됨) */
  supportConditions?: string
  /** 기타 */
  etc?: string
  /** 공통 Q&A */
  faq?: ContestFaqItem[]
  /** 공통 법적·운영 안내 */
  legalNotice?: string
}

const DEFAULT_FAQ: ContestFaqItem[] = [
  {
    question: "영상 편집 툴 제한이 있나요?",
    answer:
      "제한 없습니다. 자유롭게 편집 툴 사용 가능하며, 영상 콘셉트와 전달력이 중요합니다.",
  },
  {
    question: "개인 SNS 계정이 없어도 참여할 수 있나요?",
    answer:
      "팀원 중 1명의 계정으로 업로드 가능하며, URL 제출 필수입니다.",
  },
  {
    question: "저작권 있는 음원/음악 사용이 가능한가요?",
    answer:
      "공식 음원/제공 음원 사용 권장하며, 저작권 침해 가능성이 있는 경우 심사 제외될 수 있습니다.",
  },
  {
    question: "팀 참여 시 최대 인원은?",
    answer:
      "최대 4명까지 참여 가능하며, 팀 구성은 자유롭게 기획·촬영·편집 역할 분담 가능합니다.",
  },
  {
    question: "숏폼 플랫폼 외에 다른 형식으로 제출 가능?",
    answer:
      "원칙적으로 틱톡, 인스타 릴스, 유튜브 쇼츠 권장. 다른 형식 제출 시 심사 기준에 영향 가능합니다.",
  },
  {
    question: "수상 후 영상 활용은 어떻게 되나요?",
    answer:
      "수상작은 주최 측 공식 채널 및 SNS 홍보에 활용되며, 필요 시 원본 파일 제출을 요청할 수 있습니다.",
  },
]

const DEFAULT_LEGAL_NOTICE = `• 출품 영상은 참가자(팀)가 직접 기획·제작한 순수 창작물이어야 하며, 타인 저작물(음원, 영상, 이미지, 폰트 등) 무단 사용 시 법적 책임은 참가자에게 있습니다.
• 영상에 포함된 인물의 초상권 자료는 반드시 사전 서면 동의를 받아야 하며, 미동의 시 심사 제외 또는 수상 취소될 수 있습니다.
• AI 생성 콘텐츠 사용 시, 활용 범위와 출처를 명시해야 하며, 라이선스 문제 발생 시 평가 제외 또는 수상 취소될 수 있습니다.
• 제출된 영상은 반환되지 않으며, 주최 측은 비상업적 홍보·보도·마케팅 목적에 활용할 수 있습니다.
• 공모전 참가와 관련한 제3자 권리 침해 및 법적 분쟁 책임은 참가자에게 있으며, 주최 측은 면책됩니다.
• 표절, 도용, 허위 사실, 타 공모전 출품물 재사용 등 부정행위가 확인될 경우 수상 취소 및 상금 환수 조치가 진행됩니다.
• 제출 자료는 통계·연구·교육 목적으로 활용될 수 있으며, 공모전 관련 내부 자료 및 미공개 정보는 외부 유출 금지가 적용됩니다.
• 참가자는 출품 시 위 사항에 모두 동의한 것으로 간주됩니다.`

const CONTEST_DETAIL_EXTENSIONS: Record<string, Partial<ContestDetailData>> = {
  contest_1: {
    content: `블링엔터테인먼트 가수 뉴진스 홍보 바이럴 영상 제작 공모전입니다.

필수 해시태그 #NEWJEANS #뉴진스 포함해 주세요.

출품 방법: 제작 영상을 자신의 SNS에 게시한 후, 해당 SNS 링크를 제출해 주시면 됩니다.`,
    benefits:
      "• 1등: 상금 500만원 및 블링엔터테인먼트 공식 채널 노출\n• 2등: 상금 300만원\n• 3등: 상금 100만원\n• 입선: 뉴진스 공식 굿즈 세트",
    platforms: ["유튜브 쇼츠", "인스타그램 릴스", "틱톡"],
    supportConditions: "팔로워 수 1,000명 이상 크리에이터 (개인·팀 참여 가능)",
    faq: DEFAULT_FAQ,
    legalNotice: DEFAULT_LEGAL_NOTICE,
  },
  contest_2: {
    content: `2026 브랜드 숏폼 UGC 공모전에 참여해 주세요.

브랜드 콘셉트에 맞는 창의적인 숏폼 영상을 제작해 주시면 됩니다. 틱톡, 인스타 릴스, 유튜브 쇼츠 중 선택 가능합니다.`,
    benefits:
      "• 대상: 상금 1,000만원 및 브랜드 앰버서더 계약\n• 최우수: 상금 500만원\n• 우수: 상금 200만원\n• 장려: 브랜드 제품 패키지",
    platforms: ["유튜브", "인스타그램", "틱톡"],
    supportConditions: "블링 가입 회원 누구나 (개인·팀 참여 가능)",
    etc: "제출 파일 형식: MP4, 9:16 비율, 60초 이내 권장.",
    faq: DEFAULT_FAQ,
    legalNotice: DEFAULT_LEGAL_NOTICE,
  },
}

export function getContestDetail(id: string): ContestDetailData | null {
  const base = CONTESTS_DATA.find((c) => c.id === id)
  if (!base) return null
  const ext = CONTEST_DETAIL_EXTENSIONS[id] ?? {}
  return {
    ...base,
    content: ext.content ?? base.summary,
    benefits: ext.benefits,
    platforms: ext.platforms,
    supportConditions: ext.supportConditions ?? base.eligibility,
    etc: ext.etc,
    faq: ext.faq ?? DEFAULT_FAQ,
    legalNotice: ext.legalNotice ?? DEFAULT_LEGAL_NOTICE,
  }
}

/** 접수 마감일 파싱 (YYYY.MM.DD 또는 YYYY.MM.DD ~ YYYY.MM.DD 형식에서 마지막 날짜 추출) */
export function parseApplicationEndDate(applicationPeriod: string): Date | null {
  const match = applicationPeriod.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/g)
  if (!match || match.length === 0) return null
  const last = match[match.length - 1]
  const [y, m, d] = last.split(".").map(Number)
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? null : date
}

export function getDaysUntilEnd(endDate: Date | null): number | null {
  if (!endDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  const diff = Math.ceil((end.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
  return diff
}
