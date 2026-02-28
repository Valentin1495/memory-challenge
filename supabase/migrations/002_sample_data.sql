-- 샘플 데이터: 오늘 날짜의 카테고리와 단어
--
-- 단어는 15개 이상 등록 권장 (HARD 모드: 12+3=15개 사용)
-- 어떤 단어를 보여줄지는 클라이언트에서 난이도에 따라 랜덤 결정

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE, '과일')
ON CONFLICT (date) DO NOTHING;

WITH today_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT today_category.id, word_data.word
FROM today_category,
(VALUES
  ('사과'), ('바나나'), ('포도'), ('수박'), ('딸기'),
  ('오렌지'), ('키위'), ('망고'), ('복숭아'), ('체리'),
  ('레몬'), ('자두'), ('메론'), ('파인애플'), ('블루베리')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = today_category.id
);
