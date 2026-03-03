-- 학교 과목 카테고리 (CURRENT_DATE + 4)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 4, '학교 과목')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 4 AND name = '학교 과목' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('수학'), ('영어'), ('과학'), ('국어'), ('사회'),
  ('역사'), ('지리'), ('음악'), ('미술'), ('체육'),
  ('도덕'), ('기술'), ('가정'), ('한문'), ('철학'),
  ('경제'), ('생물'), ('물리'), ('화학'), ('정보')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
