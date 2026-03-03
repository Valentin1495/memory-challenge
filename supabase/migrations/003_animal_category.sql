-- 동물 카테고리 (내일 날짜)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 1, '동물')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 1 AND name = '동물' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('개'), ('고양이'), ('토끼'), ('사자'), ('호랑이'),
  ('코끼리'), ('기린'), ('원숭이'), ('펭귄'), ('독수리'),
  ('돌고래'), ('상어'), ('곰'), ('늑대'), ('여우'),
  ('말'), ('소'), ('오리'), ('치타'), ('하마')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
