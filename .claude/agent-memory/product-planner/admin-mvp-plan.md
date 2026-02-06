# 관리자 페이지 MVP 기획서

> **최종 업데이트**: 2026-02-06
> **상태**: 확정 (사용자 확인 완료)

## 1. 개요

### 1.1 목적
- 블링 플랫폼의 핵심 콘텐츠(공모전, 인플루언서, 숏폼)를 관리하는 어드민 시스템 구축
- 인플루언서 심사/승인 및 정보 관리
- 공모전 생성/수정 및 제출작 관리
- 인플루언서가 등록한 숏폼 콘텐츠 관리

### 1.2 대상 사용자
- 블링 운영팀 (DB에서 `userType='admin'`으로 설정된 계정)

### 1.3 핵심 가치
- 플랫폼 핵심 자산(크리에이터, 콘텐츠) 효율적 관리
- 인플루언서 온보딩 프로세스 자동화 및 품질 관리
- 공모전 운영 효율화

### 1.4 확정 사항 ✅
| 항목 | 결정 |
|------|------|
| 관리자 계정 | DB에서 `userType='admin'` 직접 설정 |
| 앱 구조 | `apps/admin` 별도 앱으로 분리 |
| 공모전 제출 | 한 공모전에 **여러 작품 제출 가능** |
| 영상 업로드 | **외부 URL 입력** (YouTube, TikTok 등) |
| 콘텐츠 상태 | `status` + `isPublic` **2개 필드로 분리** |
| 알림 기능 | MVP에서는 **제외** |
| 감사 로그 | **기본 로그 포함** (누가/언제 승인/거절) |

### 1.5 보류된 기능
- 캠페인 관리
- 정산 기능
- 이메일 알림

---

## 2. 요구사항

### 2.1 기능 요구사항 (Functional Requirements)

#### A. 인플루언서 관리

**A-1. 인플루언서 목록 조회**
- 전체 인플루언서 목록을 테이블 형태로 표시
- 필터링:
  - 상태별 (draft/active/rejected/suspended/hidden)
  - 카테고리별
  - 티어별
  - 가입일 범위
- 정렬:
  - 가입일 (최신순/오래된순)
  - 이름 (가나다순)
  - 팔로워 수 (많은순/적은순)
  - 콘텐츠 수 (많은순/적은순)
- 검색:
  - 이름, 닉네임, 이메일, 전화번호로 검색
- 페이지네이션 (50개씩)

**A-2. 인플루언서 상세 정보 조회**
- 기본 정보 표시
  - 프로필 이미지, 이름, 닉네임, 성별, 생년월일
  - 이메일, 휴대폰, 전화번호
  - 소속회사, 추천인코드
  - 가입일, 최종 수정일
- 카테고리 목록 표시
- SNS 채널 목록 표시 (플랫폼, URL, 팔로워수)
- 티어 정보 표시
- 상태 정보 표시

**A-3. 인플루언서 승인/거절**
- draft 상태의 인플루언서를 심사하여:
  - 승인 → active 상태로 변경
  - 거절 → rejected 상태로 변경 (거절 사유 입력)
- 거절 사유는 별도 메모 또는 로그 기록 (향후 확장)

**A-4. 인플루언서 상태 변경**
- active ↔ hidden (노출/비노출 토글)
- active → suspended (위반 등의 이유로 중지, 사유 입력)
- suspended → active (재활성화)

**A-5. 인플루언서 정보 수정**
- 티어 변경
- 카테고리 수정
- 기본 정보 수정 (이름, 닉네임, 연락처, 소속회사 등)

---

#### B. 공모전 관리

**현재 상태 확인 필요:**
- DB 스키마에 공모전 모델이 없음 (현재는 `apps/web/src/data/contests.ts`에 정적 데이터)
- 공모전 제출작 관리를 위한 모델도 없음

**필요한 DB 모델 (신규 추가):**
1. **Contest (공모전)**
   - id, title, summary, description
   - posterImageUrl
   - type (창작/창작&홍보)
   - contentType (숏폼 등)
   - eligibility (지원자격)
   - applicationPeriodStart, applicationPeriodEnd
   - announcementDate
   - status (draft/active/closed/canceled)
   - createdAt, updatedAt, createdBy

2. **ContestSubmission (공모전 제출작)**
   - id, contestId, influencerId
   - contentUrl (제출한 SNS 링크)
   - contentType (영상/이미지 등)
   - submittedAt
   - status (pending/approved/rejected)
   - reviewNote (심사 메모)
   - reviewedAt, reviewedBy

**기능 요구사항:**

**B-1. 공모전 목록 조회**
- 전체 공모전 목록 표시
- 필터링:
  - 상태별 (draft/active/closed/canceled)
  - 타입별 (창작/창작&홍보)
  - 날짜 범위 (접수일/발표일)
- 정렬:
  - 생성일 (최신순/오래된순)
  - 접수일 (시작일 기준)
- 검색:
  - 제목으로 검색
- 페이지네이션

**B-2. 공모전 생성**
- 제목, 요약, 상세 설명 입력
- 포스터 이미지 업로드
- 타입 선택 (창작/창작&홍보)
- 콘텐츠 유형 입력
- 지원자격 입력
- 접수 기간 설정 (시작일, 종료일)
- 발표일 설정
- 상태 선택 (draft/active)

**B-3. 공모전 수정**
- 모든 필드 수정 가능
- 진행 중인 공모전도 수정 가능 (단, 주의 메시지 표시)

**B-4. 공모전 삭제 또는 취소**
- 상태를 canceled로 변경 (soft delete)

**B-5. 공모전 제출작 조회**
- 특정 공모전의 제출작 목록 표시
- 필터링:
  - 상태별 (pending/approved/rejected)
- 정렬:
  - 제출일 (최신순/오래된순)
- 제출자 정보 (인플루언서 이름, 프로필 이미지)
- 제출 콘텐츠 URL
- 제출일

**B-6. 공모전 제출작 심사**
- 제출작 승인 (approved)
- 제출작 거절 (rejected, 사유 입력)
- 심사 메모 작성

---

#### C. 숏폼 콘텐츠 관리

**확정된 플로우:**
```
인플루언서 등록 (pending)
    → 관리자 승인 (approved) / 거절 (rejected)
    → 인플루언서가 마이페이지에서 "오픈" 설정 (isPublic: true) → 노출
    → 인플루언서가 "비공개" 설정 (isPublic: false) → 비노출
```

**상태 관리: 2개 필드 분리**
- `status`: pending(대기) / approved(승인) / rejected(거절)
- `isPublic`: true(공개) / false(비공개) - 인플루언서가 설정

**필요한 DB 모델 (신규 추가):**
1. **Content (숏폼 콘텐츠)**
   - id, influencerId
   - title, description
   - videoUrl (외부 URL: YouTube, TikTok 등)
   - thumbnailUrl (썸네일 이미지)
   - duration (영상 길이, 초 단위)
   - tags (태그 배열)
   - viewCount, likeCount (조회수, 좋아요 수)
   - licensePrice (라이센싱 가격)
   - secondaryCreationStatus (2차 저작 허용 상태: 1/2/3)
   - **status** (pending/approved/rejected) - 관리자 관리
   - **isPublic** (boolean, default: false) - 인플루언서 설정
   - createdAt, updatedAt
   - publishedAt (첫 공개일)
   - **approvedAt, approvedBy** (승인일, 승인자) - 감사 로그

**기능 요구사항:**

**C-1. 숏폼 콘텐츠 목록 조회**
- 전체 콘텐츠 목록 표시 (썸네일 그리드 또는 테이블)
- 필터링:
  - 상태별 (pending/approved/rejected)
  - 공개여부 (isPublic)
  - 인플루언서별
  - 태그별
  - 등록일 범위
- 정렬:
  - 등록일 (최신순/오래된순)
  - 조회수 (많은순/적은순)
  - 좋아요 수 (많은순/적은순)
- 검색:
  - 제목, 태그로 검색
- 페이지네이션

**C-2. 숏폼 콘텐츠 상세 조회**
- 영상 플레이어 (외부 URL embed)
- 제목, 설명, 태그
- 업로더 정보 (인플루언서 이름, 프로필 이미지)
- 조회수, 좋아요 수
- 라이센싱 가격, 2차 저작 허용 상태
- 등록일, 승인일, 공개일
- 상태 (pending/approved/rejected) + 공개여부 (isPublic)

**C-3. 숏폼 콘텐츠 승인/거절 (관리자)**
- pending → approved (승인) - approvedAt, approvedBy 기록
- pending → rejected (거절, 사유 입력)
- approved → rejected (승인 취소)

**C-4. 숏폼 콘텐츠 수정 (관리자)**
- 제목, 설명, 태그 수정
- 썸네일 이미지 교체
- 라이센싱 가격 수정
- 2차 저작 허용 상태 수정

**C-5. 숏폼 콘텐츠 강제 비공개 (관리자)**
- isPublic: true → false (문제 있는 콘텐츠 강제 비공개)

---

#### D. 공통 기능

**D-1. 대시보드**
- 주요 통계 표시:
  - 전체 인플루언서 수 (상태별)
  - 승인 대기 중인 인플루언서 수
  - 진행 중인 공모전 수
  - 전체 숏폼 콘텐츠 수 (상태별)
- 최근 활동:
  - 최근 가입한 인플루언서 (5명)
  - 최근 등록된 숏폼 (5개)
  - 최근 공모전 제출작 (5개)

**D-2. 인증 및 권한**
- 로그인: 일반 로그인과 동일한 흐름 사용
- 권한 체크: `userType='admin'`인 경우에만 접근 가능
- 비관리자 접근 시 403 또는 리다이렉트

**D-3. 콘텐츠 블록 편집 (이미 구현됨)**
- `ContentBlock` 모델 활용
- 웹 에디터로 HTML 콘텐츠 수정

---

### 2.2 비기능 요구사항 (Non-functional Requirements)

**성능**
- 목록 조회 페이지: 초기 로딩 2초 이내
- 필터/정렬 적용: 1초 이내
- 이미지 업로드: 5MB 이하, 10초 이내

**보안**
- 관리자 권한 체크 필수 (모든 API에 middleware 적용)
- CSRF 방지
- 이미지 업로드 시 파일 타입/크기 검증

**사용성**
- 테이블 형태의 목록 화면 (데스크톱 우선)
- 모바일 대응 (웹뷰 고려)
- 필터/검색 UI는 접거나 펼칠 수 있도록

**확장성**
- 각 모듈(인플루언서/공모전/콘텐츠)을 독립적인 페이지로 분리
- 나중에 캠페인/정산 모듈 추가 가능한 구조

---

## 3. 사용자 플로우

### 3.1 인플루언서 심사 플로우
1. 관리자 → 대시보드 → "승인 대기 중인 인플루언서" 확인
2. 인플루언서 관리 → 목록 → 상태 필터 "draft" 선택
3. 특정 인플루언서 클릭 → 상세 정보 확인
4. SNS 채널, 카테고리, 프로필 검토
5. **승인** 버튼 클릭 → 상태가 "active"로 변경 → (향후) 인플루언서에게 승인 알림
6. 또는 **거절** 버튼 클릭 → 거절 사유 입력 → 상태가 "rejected"로 변경

### 3.2 공모전 생성 및 운영 플로우
1. 관리자 → 공모전 관리 → "공모전 생성" 버튼 클릭
2. 제목, 요약, 설명 입력 → 포스터 이미지 업로드
3. 타입, 지원자격, 접수기간, 발표일 설정
4. 상태 "active"로 설정 → 저장 → 공모전이 사용자 페이지에 노출됨
5. 접수 기간 중 인플루언서들이 콘텐츠 제출
6. 관리자 → 공모전 상세 → "제출작 관리" 탭 → 제출작 목록 확인
7. 제출작 하나씩 심사 → 승인/거절
8. 발표일에 맞춰 최종 결과 공개 (향후 자동화 가능)

### 3.3 숏폼 콘텐츠 관리 플로우
```
[인플루언서 등록]
1. 인플루언서 → 마이페이지 → "콘텐츠 등록"
2. 제목, 설명, 영상 URL(YouTube/TikTok 등), 태그 입력 → 저장
3. 상태: pending (승인 대기), isPublic: false

[관리자 승인]
4. 관리자 → 숏폼 관리 → 목록 → 상태 "pending" 필터
5. 새로 등록된 콘텐츠 확인 → 상세 페이지 이동
6. 영상 확인, 메타데이터 확인
7. **승인** 버튼 클릭 → status: "approved", approvedAt/approvedBy 기록
8. 또는 **거절** 버튼 클릭 → status: "rejected", 거절 사유 입력

[인플루언서 공개 설정]
9. 인플루언서 → 마이페이지 → 승인된 콘텐츠 목록
10. "공개" 버튼 클릭 → isPublic: true → 사용자 페이지에 노출
11. "비공개" 버튼 클릭 → isPublic: false → 비노출

[관리자 강제 비공개]
12. 문제 있는 콘텐츠 발견 시 → isPublic: false로 강제 변경
```

---

## 4. 화면 구성

### 4.1 전체 구조
- 레이아웃: 좌측 사이드바(네비게이션) + 우측 콘텐츠 영역
- 사이드바 메뉴:
  - 대시보드
  - 인플루언서 관리
  - 공모전 관리
  - 숏폼 관리
  - 콘텐츠 블록 편집
  - (향후) 캠페인 관리
  - (향후) 정산 관리
  - 설정

### 4.2 페이지별 구성

#### 대시보드 (`/admin`)
- 주요 통계 카드 (4개):
  - 전체 인플루언서 (상태별 분포)
  - 승인 대기 중인 인플루언서
  - 진행 중인 공모전
  - 전체 숏폼 콘텐츠
- 최근 활동 섹션 (3개):
  - 최근 가입한 인플루언서
  - 최근 등록된 숏폼
  - 최근 공모전 제출작

#### 인플루언서 관리 (`/admin/influencers`)
- **목록 페이지:**
  - 상단: 필터/검색 영역 (접기/펼치기 가능)
    - 상태, 카테고리, 티어, 가입일 범위
    - 검색: 이름/닉네임/이메일/전화번호
  - 테이블:
    - 컬럼: 프로필 이미지, 이름, 닉네임, 상태, 티어, 가입일, 액션
    - 액션: 상세보기, 승인, 거절, 상태변경
  - 하단: 페이지네이션

- **상세 페이지 (`/admin/influencers/[id]`):**
  - 기본 정보 섹션
  - SNS 채널 섹션 (테이블)
  - 티어 정보 섹션
  - 상태 관리 섹션 (버튼: 승인, 거절, 숨김, 중지, 재활성화)
  - 수정 모드 (인라인 또는 모달)

#### 공모전 관리 (`/admin/contests`)
- **목록 페이지:**
  - 상단: 필터/검색 영역
    - 상태, 타입, 날짜 범위
    - 검색: 제목
  - 테이블 또는 카드 리스트:
    - 컬럼: 포스터 이미지, 제목, 타입, 접수기간, 상태, 액션
    - 액션: 상세보기, 수정, 삭제
  - 우측 상단: "공모전 생성" 버튼

- **생성/수정 페이지 (`/admin/contests/new`, `/admin/contests/[id]/edit`):**
  - 폼:
    - 제목, 요약, 상세 설명 (WYSIWYG 에디터)
    - 포스터 이미지 업로드
    - 타입, 콘텐츠 유형, 지원자격
    - 접수 기간 (날짜 선택기)
    - 발표일 (날짜 선택기)
    - 상태 (draft/active)
  - 하단: 저장, 취소

- **상세 페이지 (`/admin/contests/[id]`):**
  - 공모전 정보 표시
  - 탭:
    - 기본 정보
    - 제출작 관리
  - 제출작 관리 탭:
    - 제출작 목록 (테이블)
    - 컬럼: 제출자, 콘텐츠 URL, 제출일, 상태, 액션
    - 액션: 승인, 거절, 메모 작성

#### 숏폼 관리 (`/admin/contents`)
- **목록 페이지:**
  - 상단: 필터/검색 영역
    - 상태, 인플루언서, 태그, 등록일 범위
    - 검색: 제목/태그
  - 그리드 또는 테이블:
    - 그리드: 썸네일, 제목, 상태, 조회수, 좋아요 수
    - 테이블: 썸네일, 제목, 인플루언서, 상태, 조회수, 좋아요, 등록일, 액션
  - 액션: 상세보기, 승인, 숨김, 삭제

- **상세 페이지 (`/admin/contents/[id]`):**
  - 영상 플레이어 (또는 URL 링크)
  - 메타데이터 표시 (제목, 설명, 태그, 업로더, 조회수, 좋아요, 라이센싱 가격, 2차 저작 허용 상태)
  - 상태 관리 버튼 (승인, 숨김, 삭제)
  - 수정 모드 (제목, 설명, 태그, 썸네일, 라이센싱 가격, 2차 저작 허용 상태)

#### 콘텐츠 블록 편집 (`/admin/content-blocks`)
- (기존 구현 활용)
- 목록: key 기준으로 블록 목록 표시
- 편집: WYSIWYG 에디터

---

## 5. 데이터 모델

### 5.1 기존 모델 (이미 구현됨)
- `User` (userType에 admin 포함)
- `Influencer` (status 필드 포함: draft/active/rejected/suspended/hidden)
- `InfluencerTier`
- `SnsChannel`
- `ContentBlock`
- `Advertiser` (관리자 페이지 MVP에서는 사용 안 함)
- `SocialPlatform`
- `TierBenefit`

### 5.2 신규 모델 (추가 필요)

#### Contest (공모전)
```prisma
model Contest {
  id                      String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title                   String
  summary                 String
  description             String   @db.Text
  posterImageUrl          String   @map("poster_image_url")
  type                    String   // "창작" | "창작&홍보"
  contentType             String   @map("content_type") // "숏폼" 등
  eligibility             String   // 지원자격
  applicationPeriodStart  DateTime @map("application_period_start") @db.Timestamptz
  applicationPeriodEnd    DateTime @map("application_period_end") @db.Timestamptz
  announcementDate        DateTime @map("announcement_date") @db.Date
  status                  String   @default("draft") // draft, active, closed, canceled

  createdAt               DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt               DateTime @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  createdBy               String?  @map("created_by") @db.Uuid // User.id (향후 확장)

  submissions             ContestSubmission[]

  @@map("contests")
}
```

#### ContestSubmission (공모전 제출작)
```prisma
model ContestSubmission {
  id           String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  contestId    String     @map("contest_id") @db.Uuid
  contest      Contest    @relation(fields: [contestId], references: [id], onDelete: Cascade)
  influencerId String     @map("influencer_id") @db.Uuid
  influencer   Influencer @relation(fields: [influencerId], references: [id], onDelete: Cascade)

  title        String?    // 제출작 제목 (선택)
  contentUrl   String     @map("content_url") // 제출한 SNS 링크
  contentType  String?    @map("content_type") // "영상", "이미지" 등 (선택)
  status       String     @default("pending") // pending, approved, rejected
  reviewNote   String?    @map("review_note") @db.Text

  submittedAt  DateTime   @default(now()) @map("submitted_at") @db.Timestamptz
  reviewedAt   DateTime?  @map("reviewed_at") @db.Timestamptz
  reviewedBy   String?    @map("reviewed_by") @db.Uuid // 승인/거절한 관리자 ID (감사 로그)

  // ❌ unique constraint 제거: 한 공모전에 여러 작품 제출 가능
  @@index([contestId])
  @@index([influencerId])
  @@map("contest_submissions")
}
```

#### Content (숏폼 콘텐츠)
```prisma
model Content {
  id                      String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  influencerId            String     @map("influencer_id") @db.Uuid
  influencer              Influencer @relation(fields: [influencerId], references: [id], onDelete: Cascade)

  title                   String
  description             String?    @db.Text
  videoUrl                String     @map("video_url") // 외부 URL (YouTube, TikTok 등)
  thumbnailUrl            String?    @map("thumbnail_url")
  duration                Int?       // 영상 길이 (초)
  tags                    String[]   // 태그 배열

  viewCount               Int        @default(0) @map("view_count")
  likeCount               Int        @default(0) @map("like_count")

  licensePrice            Int?       @map("license_price") // null = 협의
  secondaryCreationStatus Int        @default(1) @map("secondary_creation_status") // 1: 허용 안 함, 2: 일부 허용, 3: 자유 허용

  // 상태 관리: 2개 필드 분리
  status                  String     @default("pending") // pending(대기), approved(승인), rejected(거절) - 관리자 관리
  isPublic                Boolean    @default(false) @map("is_public") // 인플루언서가 설정 (승인 후에만 true 가능)
  rejectionReason         String?    @map("rejection_reason") @db.Text // 거절 사유

  // 감사 로그
  approvedAt              DateTime?  @map("approved_at") @db.Timestamptz
  approvedBy              String?    @map("approved_by") @db.Uuid // 승인한 관리자 ID

  createdAt               DateTime   @default(now()) @map("created_at") @db.Timestamptz
  updatedAt               DateTime   @default(now()) @updatedAt @map("updated_at") @db.Timestamptz
  publishedAt             DateTime?  @map("published_at") @db.Timestamptz // 첫 공개일

  @@index([influencerId])
  @@index([status])
  @@map("contents")
}
```

### 5.3 기존 모델 수정
- `Influencer`에 `submissions ContestSubmission[]` 관계 추가
- `Influencer`에 `contents Content[]` 관계 추가

---

## 6. 기술적 고려사항

### 6.1 아키텍처 결정 사항
- **앱 구조:**
  - `apps/admin` 또는 `apps/web/src/app/admin`로 관리자 페이지 구성
  - 추천: `apps/admin`을 별도 Next.js 앱으로 분리 (관리자 전용 의존성, 빌드 최적화)
- **공유 패키지:**
  - `@bling/ui` 활용 (버튼, 테이블, 폼 컴포넌트)
  - `@bling/database` 활용 (Prisma 클라이언트)
- **인증:**
  - Supabase Auth 활용 (기존과 동일)
  - Middleware에서 `userType='admin'` 체크

### 6.2 웹뷰 호환성
- 관리자 페이지는 데스크톱 우선 설계
- 모바일 웹뷰에서도 동작하도록 반응형 디자인 적용
- 단, 복잡한 관리 기능은 데스크톱 사용 권장 (안내 메시지)

### 6.3 공유 컴포넌트 활용
- `@bling/ui`에서 제공하는 shadcn/ui 컴포넌트 최대한 활용:
  - Button, Table, Input, Select, Dialog, Tabs, Badge, Card, etc.
- 관리자 전용 컴포넌트는 `apps/admin/src/components/admin`에 작성

### 6.4 이미지 업로드
- Supabase Storage 또는 S3 활용
- 업로드 플로우:
  1. 클라이언트에서 파일 선택
  2. 서버 액션 또는 API로 업로드
  3. URL 반환 → DB에 저장
- 파일 타입: jpg, png, webp (최대 5MB)
- 영상 업로드: mp4 (최대 100MB, 향후 CDN 고려)

### 6.5 API 설계
- Next.js App Router의 Server Actions 활용 (form 제출, 상태 변경)
- 복잡한 조회는 Route Handler (`/api/admin/*`) 사용
- 예시:
  - `POST /api/admin/influencers/[id]/approve` (승인)
  - `POST /api/admin/influencers/[id]/reject` (거절)
  - `PATCH /api/admin/contests/[id]` (공모전 수정)
  - `GET /api/admin/contents?status=draft&page=1` (콘텐츠 목록)

### 6.6 DB 쿼리 최적화
- 목록 조회 시 `select` 최소화 (필요한 필드만)
- 페이지네이션: `skip`, `take` 활용
- 인덱스 추가:
  - `Contest`: status, createdAt
  - `Content`: status, influencerId, createdAt
  - `ContestSubmission`: contestId, status, submittedAt

---

## 7. 우선순위 및 마일스톤

### Phase 1: 기본 틀 및 인플루언서 관리 (1-2주)
- [x] DB 스키마 확인 (기존 모델 이해)
- [ ] `apps/admin` 프로젝트 생성 (또는 `apps/web/src/app/admin`)
- [ ] 레이아웃 및 네비게이션 구현
- [ ] 대시보드 (간단한 통계 카드)
- [ ] 인플루언서 목록 조회 (필터, 검색, 정렬, 페이지네이션)
- [ ] 인플루언서 상세 조회
- [ ] 인플루언서 승인/거절 기능
- [ ] 인플루언서 상태 변경 기능

### Phase 2: 공모전 관리 (1-2주)
- [ ] DB 스키마 추가 (Contest, ContestSubmission 모델)
- [ ] 공모전 목록 조회 (필터, 검색, 정렬, 페이지네이션)
- [ ] 공모전 생성 (포스터 이미지 업로드 포함)
- [ ] 공모전 수정 및 삭제
- [ ] 공모전 제출작 목록 조회
- [ ] 공모전 제출작 심사 (승인/거절)
- [ ] 사용자 페이지에서 공모전 제출 기능 구현 (인플루언서용)

### Phase 3: 숏폼 콘텐츠 관리 (1-2주)
- [ ] DB 스키마 추가 (Content 모델)
- [ ] 숏폼 콘텐츠 목록 조회 (필터, 검색, 정렬, 페이지네이션)
- [ ] 숏폼 콘텐츠 상세 조회
- [ ] 숏폼 콘텐츠 상태 변경 (승인, 숨김, 삭제)
- [ ] 숏폼 콘텐츠 수정 (메타데이터)
- [ ] 사용자 페이지에서 숏폼 등록 기능 구현 (인플루언서용)

### Phase 4: 개선 및 최적화 (1주)
- [ ] 대시보드 통계 고도화 (그래프, 차트)
- [ ] 콘텐츠 블록 편집 기능 통합 (기존 구현 활용)
- [ ] 에러 핸들링 및 사용자 피드백 개선
- [ ] 성능 최적화 (쿼리, 이미지 로딩)
- [ ] 모바일 웹뷰 대응 개선

---

## 8. 확정 사항 및 남은 질문

### 8.1 확정 사항 ✅
| 항목 | 결정 | 비고 |
|------|------|------|
| 관리자 계정 | DB에서 `userType='admin'` 직접 설정 | |
| 앱 구조 | `apps/admin` 별도 앱으로 분리 | |
| 공모전 제출 | 한 공모전에 **여러 작품 제출 가능** | unique constraint 제거 |
| 영상 업로드 | **외부 URL 입력** (YouTube, TikTok 등) | |
| 콘텐츠 상태 | `status` + `isPublic` **2개 필드로 분리** | 관리자 승인 + 인플루언서 공개 설정 |
| 알림 기능 | MVP에서는 **제외** | 향후 추가 |
| 감사 로그 | **기본 로그 포함** | approvedAt, approvedBy 필드 |

### 8.2 남은 질문 (필요시 확인)

**인플루언서 관리:**
1. 거절 사유는 `Influencer` 모델에 `rejectionReason` 필드로 추가할까요?
2. 중지된(suspended) 인플루언서는 로그인 차단해야 하나요?

**공모전 관리:**
3. 공모전 타입 "창작", "창작&홍보" 외에 향후 추가 가능성이 있나요?
4. 승인된 제출작에 순위/상금 정보를 기록해야 하나요?

**숏폼 콘텐츠:**
5. "협의" 옵션은 `licensePrice: null`로 저장하면 되나요?
6. "일부 허용"(2차 저작)의 구체적 기준이 있나요?

**기타:**
7. 관리자 권한 레벨이 여러 개인가요? (super admin, editor 등)
8. Hard delete(완전 삭제) 기능이 필요한가요? (현재는 soft delete만 가정)

> 위 질문들은 MVP 구현 중 필요시 확인하면 됩니다.

---

## 9. 참고 사항

### 9.1 현재 구현 상태
- `apps/web`에 인플루언서, 공모전, 콘텐츠 페이지가 있으나, **정적 데이터**를 사용 중
- DB 스키마에는 `Influencer` 모델만 있고, `Contest`, `Content` 모델은 없음
- `ContentBlock` 모델이 있어 관리자가 웹 에디터로 HTML 콘텐츠를 수정 가능

### 9.2 우선 작업 순서 제안
1. 사용자와 질문 목록 확인 및 답변 받기
2. DB 스키마 추가 (Contest, ContestSubmission, Content)
3. `apps/admin` 프로젝트 생성 (또는 `apps/web/src/app/admin`)
4. Phase 1부터 순차적 구현

### 9.3 추가 고려 사항
- **검색 기능:** 향후 Algolia, Elasticsearch 등 검색 엔진 도입 고려
- **실시간 업데이트:** 대시보드 통계는 실시간 업데이트가 필요한가? (WebSocket, polling)
- **엑셀 내보내기:** 인플루언서, 공모전 제출작 등을 엑셀로 다운로드하는 기능 필요?
- **이미지 리사이징:** 업로드 시 자동으로 썸네일 생성?

---

## 10. 업데이트 로그

- 2026-02-06: 초안 작성
