-- 음식 카테고리 (과일 제외, CURRENT_DATE + 5)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 5, '음식')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 5 AND name = '음식' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('김치찌개'), ('된장찌개'), ('비빔밥'), ('불고기'), ('삼겹살'),
  ('냉면'), ('삼계탕'), ('순대'), ('떡볶이'), ('라면'),
  ('피자'), ('햄버거'), ('파스타'), ('초밥'), ('짜장면'),
  ('짬뽕'), ('탕수육'), ('치킨'), ('샌드위치'), ('카레')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
