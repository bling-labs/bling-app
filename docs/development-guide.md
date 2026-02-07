# 개발 가이드

개발 환경 설정, Prisma, 마이그레이션 등 개발에 필요한 작업을 정리한 문서입니다.

---

## Prisma

### Prisma generate는 언제 필요해?

`@prisma/client`는 `pnpm install`만으로 생성되지 않습니다. 다음 경우에 `prisma generate`를 실행해야 합니다.

| 상황 | 필요한 작업 |
|------|-------------|
| **node_modules 재설치 후** (git clone, pnpm install) | `prisma generate` 필수 |
| **schema.prisma 수정 후** | `prisma generate` (마이그레이션 시 자동 실행됨) |
| **타입/모델 추가·수정 후** | `prisma generate` |

generate를 하지 않으면 `@prisma/client did not initialize yet` 에러가 발생합니다.

### prisma generate 실행 방법

```bash
# 루트에서
pnpm --filter @bling/database db:generate

# 또는 packages/database에서
cd packages/database
pnpm db:generate
```

---

## 마이그레이션

### 스키마 변경 후 새 마이그레이션 만들기

1. `packages/database/prisma/schema.prisma` 수정
2. 마이그레이션 생성 및 적용:

```bash
cd packages/database
pnpm db:migrate -- --name <마이그레이션_이름>
```

예:

```bash
pnpm db:migrate -- --name add_user_status
```

- 마이그레이션 이름을 물어보면 `init`, `add_xxx` 등 의미 있는 이름 입력
- `prisma/migrations/` 하위에 새 폴더가 생성되고 SQL이 적용됨
- `prisma generate`는 마이그레이션 과정에서 자동 실행됨

### 최초 마이그레이션 (DB가 비어 있을 때)

```bash
cd packages/database
pnpm db:migrate
# 이름 입력 요청 시: init 또는 원하는 이름
```

### 프로덕션 배포 시 마이그레이션

개발용 `migrate dev`가 아니라 `migrate deploy` 사용:

```bash
cd packages/database
npx prisma migrate deploy
```

- `migrate deploy`는 기존 마이그레이션만 적용하고, 새 마이그레이션은 생성하지 않음
- CI/CD 파이프라인에서 사용

### db:push vs migrate

| 명령어 | 용도 |
|--------|------|
| `pnpm db:migrate` | 개발용. 마이그레이션 이력 생성 + 적용. 팀 협업, 프로덕션 배포에 사용 |
| `pnpm db:push` | 프로토타입/로컬 실험용. 스키마를 DB에 바로 반영. 마이그레이션 파일 생성 안 함 |

- 실제 개발/운영: **migrate** 사용 권장
- 빠른 스키마 실험: **db:push** 사용 가능 (마이그레이션 이력 없음)

---

## 환경변수

- **DB URL**: `packages/database/.env`
  - `DATABASE_URL`: Prisma 연결용 (Connection Pooler URL)
  - `DIRECT_URL`: 마이그레이션용 (직접 연결 URL, Supabase Pooler 시 필요)
- **앱 환경변수**: `apps/web/.env.local` (Supabase, API 키 등)

---

## Seed 데이터

### influencer_tiers (인플루언서 티어)

```sql
INSERT INTO influencer_tiers (id, name, level, description, settlement_rate, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Bronze',   1, '기본 티어',       0.6000, now(), now()),
  (gen_random_uuid(), 'Silver',   2, '실버 티어',       0.6500, now(), now()),
  (gen_random_uuid(), 'Gold',     3, '골드 티어',       0.7000, now(), now()),
  (gen_random_uuid(), 'Platinum', 4, '플래티넘 티어',   0.7500, now(), now()),
  (gen_random_uuid(), 'Diamond',  5, '다이아몬드 티어', 0.8000, now(), now())
ON CONFLICT (name) DO UPDATE SET
  level           = EXCLUDED.level,
  description     = EXCLUDED.description,
  settlement_rate = EXCLUDED.settlement_rate,
  updated_at      = now();
```

---

## 자주 쓰는 명령어 요약

```bash
# node_modules 재설치 후 (generate 필수)
pnpm install
pnpm --filter @bling/database db:generate

# 스키마 변경 후 새 마이그레이션
cd packages/database
pnpm db:migrate -- --name <이름>

# DB GUI 열기
cd packages/database
pnpm db:studio
```
