-- 탈것 카테고리 (CURRENT_DATE + 2)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 2, '탈것')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 2 AND name = '탈것' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('자동차'), ('버스'), ('지하철'), ('기차'), ('비행기'),
  ('배'), ('자전거'), ('오토바이'), ('트럭'), ('택시'),
  ('헬리콥터'), ('트램'), ('유람선'), ('스쿠터'), ('열기구'),
  ('로켓'), ('잠수함'), ('경찰차'), ('구급차'), ('소방차')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
