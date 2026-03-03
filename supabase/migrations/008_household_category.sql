-- 집 안 물건 카테고리 (CURRENT_DATE + 6)
-- 날짜를 변경하려면 CURRENT_DATE + N 을 원하는 날짜로 교체하세요.

INSERT INTO daily_categories (date, name) VALUES (CURRENT_DATE + 6, '집 안 물건')
ON CONFLICT (date) DO NOTHING;

WITH target_category AS (
  SELECT id FROM daily_categories WHERE date = CURRENT_DATE + 6 AND name = '집 안 물건' LIMIT 1
)
INSERT INTO words (category_id, word)
SELECT target_category.id, word_data.word
FROM target_category,
(VALUES
  ('소파'), ('침대'), ('냉장고'), ('세탁기'), ('에어컨'),
  ('텔레비전'), ('전자레인지'), ('식탁'), ('의자'), ('책상'),
  ('옷장'), ('거울'), ('선풍기'), ('청소기'), ('다리미'),
  ('전기밥솥'), ('커튼'), ('욕조'), ('화분'), ('시계')
) AS word_data(word)
WHERE NOT EXISTS (
  SELECT 1 FROM words w WHERE w.category_id = target_category.id
);
