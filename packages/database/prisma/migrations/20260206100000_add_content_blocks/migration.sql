-- CreateTable
CREATE TABLE "content_blocks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "content_blocks_key_key" ON "content_blocks"("key");

-- Insert sample influencer registration guide (HTML)
INSERT INTO "content_blocks" ("id", "key", "content", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'influencer_registration_guide',
  $$<div class="space-y-4">
  <h3 class="text-lg font-semibold">인플루언서 등록 안내</h3>
  <p>Bling에 인플루언서로 등록하시면 콘텐츠 라이센싱 및 협업 기회를 활용하실 수 있습니다.</p>
  <ul class="list-disc list-inside space-y-2">
    <li>등록 후 기본 정보(이름, 활동명, 카테고리 등)와 소셜 채널을 입력해주세요.</li>
    <li>최소 1개 이상의 소셜 채널(유튜브, 인스타그램, 틱톡 등) URL이 필요합니다.</li>
    <li>제출된 정보는 검토 후 서비스에 노출됩니다.</li>
  </ul>
  <p class="text-sm text-muted-foreground">아래 <strong>확인</strong> 버튼을 누르면 기본 정보 입력 단계로 이동합니다.</p>
</div>$$,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
