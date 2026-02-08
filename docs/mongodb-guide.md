# MongoDB 가이드

## ===== 세팅 =====

### 1. 패키지 구조

MongoDB 연동은 `@bling/mongodb` 워크스페이스 패키지로 관리된다.

```
packages/mongodb/
├── package.json        # @bling/mongodb (mongodb ^6.16.0)
├── tsconfig.json       # @bling/typescript-config/base.json 확장
└── src/
    ├── client.ts       # MongoClient 싱글턴 + getDb() 헬퍼
    └── index.ts        # export
```

기존 `@bling/database`(Prisma/Supabase PostgreSQL)와 동일한 패턴으로, TypeScript 소스를 그대로 export하고 앱에서 `transpilePackages`로 트랜스파일한다.

### 2. 환경변수

`apps/web/.env.local`에 MongoDB Atlas 연결 문자열 추가:

```env
# MongoDB Atlas
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<AppName>"
```

MongoDB Atlas 대시보드 > Database > Connect > Drivers 에서 URI를 복사해 붙여넣으면 된다.

### 3. 사용법

서버 사이드(Server Action, API Route 등)에서 임포트:

```ts
import { getDb } from "@bling/mongodb"

const db = await getDb()           // 기본 DB: "bling"
const db2 = await getDb("other")   // 다른 DB명 지정 가능

// 컬렉션 접근 & 문서 삽입
await db.collection("ad_requests").insertOne({ ... })

// 문서 조회
const docs = await db.collection("ad_requests").find({ status: "pending" }).toArray()
```

`mongoClient` 싱글턴도 직접 사용 가능:

```ts
import { mongoClient } from "@bling/mongodb"

// ping 테스트
await mongoClient.db("admin").command({ ping: 1 })
```

개발 환경에서는 `globalThis`에 클라이언트를 캐싱하여 HMR 시 커넥션이 누적되지 않는다.

### 4. 연결 확인

`pnpm dev` 실행 후 브라우저에서 접속:

```
http://localhost:3000/api/mongo-test
```

성공 시 응답 예시:

```json
{
  "status": "connected",
  "ping": { "ok": 1 },
  "database": "bling",
  "collections": ["ad_requests"]
}
```

서버 콘솔에도 `[MongoDB] 연결 성공` 로그가 출력된다.

### 5. 현재 사용처

| 컬렉션 | 용도 | Server Action |
|--------|------|---------------|
| `ad_requests` | 콘텐츠 제작 의뢰 폼 데이터 | `submitAdRequest()` in `apps/web/src/app/(public)/explore/contents/[id]/actions.ts` |

### 6. PostgreSQL(Prisma)과의 역할 분담

- **PostgreSQL (Prisma)**: 사용자, 인플루언서, 광고주, SNS 채널 등 관계형 데이터
- **MongoDB**: 콘텐츠 제작 의뢰 등 폼 필드가 자주 변경될 수 있는 문서형 데이터

## ===== 세팅 끝 =====
