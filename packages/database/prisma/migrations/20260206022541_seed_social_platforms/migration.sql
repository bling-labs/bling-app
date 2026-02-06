-- Seed social_platforms: youtube, instagram, tiktok (default visible), blog, x (non-default, shown when "Other" expanded)
INSERT INTO "social_platforms" ("id", "code", "label", "is_default_visible", "sort_order")
VALUES
  (gen_random_uuid(), 'youtube', '유튜브', true, 1),
  (gen_random_uuid(), 'instagram', '인스타그램', true, 2),
  (gen_random_uuid(), 'tiktok', '틱톡', true, 3),
  (gen_random_uuid(), 'blog', '블로그', false, 4),
  (gen_random_uuid(), 'x', 'X (Twitter)', false, 5)
ON CONFLICT ("code") DO NOTHING;
