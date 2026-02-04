# 블링 모노레포 가이드

## 구조

```
bling-app/                    ← 루트 (여기서 명령어 실행)
├── apps/
│   └── web/                  ← 공개 웹사이트 (Next.js 16)
├── packages/
│   ├── ui/                   ← 공유 UI 컴포넌트 (@bling/ui)
│   └── typescript-config/    ← 공유 TS 설정
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 패키지 매니저

**pnpm** 사용 (npm 아님). 모든 명령어는 `pnpm`으로 실행.

```bash
# pnpm이 없다면 설치
npm install -g pnpm
```

## 실행 명령어

모든 명령어는 **루트 디렉토리** (`bling-app/`)에서 실행.

```bash
# 개발 서버 실행
pnpm dev

# web 앱만 실행 (더 빠름)
pnpm dev --filter=@bling/web

# 프로덕션 빌드
pnpm build

# 린트
pnpm lint
```

## 새 shadcn 컴포넌트 추가

```bash
# 1. packages/ui 디렉토리에서 설치
cd packages/ui
npx shadcn@latest add <component-name>

# 2. 생성된 파일에서 import 경로 수정
#    @/lib/utils  →  ../lib/utils
#    @/components/button  →  ./button

# 3. packages/ui/src/index.ts에 export 추가
#    export { NewComponent } from "./components/new-component"
```

## 앱에서 UI 컴포넌트 사용

```tsx
// @bling/ui에서 직접 import
import { Button, Dialog, Input } from "@bling/ui"

// cn() 유틸리티는 기존 경로도 동작
import { cn } from "@/lib/utils"
```

## 새 패키지 의존성 추가

```bash
# 특정 앱에 추가
pnpm add <package-name> --filter=@bling/web

# UI 패키지에 추가
pnpm add <package-name> --filter=@bling/ui

# 루트 devDependency 추가
pnpm add -Dw <package-name>
```

## 향후 새 앱 추가 (예: 광고주 대시보드)

1. `apps/advertiser/` 디렉토리 생성
2. Next.js 앱 초기화
3. `package.json`에 `@bling/ui: workspace:*` 의존성 추가
4. `next.config.ts`에 `transpilePackages: ["@bling/ui"]` 추가
5. `globals.css`에 `@source "../../../../packages/ui/src";` 추가
6. `tsconfig.json`에 `@bling/ui` 경로 매핑 추가
