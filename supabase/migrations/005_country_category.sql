-- 나라 카테고리 (CURRENT_DATE + 3)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 3, '나라')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 3 AND name = '나라' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('한국'), ('미국'), ('일본'), ('중국'), ('프랑스'),
  ('독일'), ('영국'), ('이탈리아'), ('스페인'), ('브라질'),
  ('캐나다'), ('호주'), ('인도'), ('러시아'), ('멕시코'),
  ('아르헨티나'), ('네덜란드'), ('스위스'), ('포르투갈'), ('스웨덴')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
