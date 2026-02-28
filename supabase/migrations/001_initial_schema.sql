-- Memory Challenge Game Database Schema

-- 일간 카테고리 테이블
CREATE TABLE IF NOT EXISTS daily_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 단어 테이블
-- not_shown 컬럼 없음: 어떤 단어를 보여줄지는 클라이언트에서 난이도에 따라 결정
-- 카테고리당 최소 15개 (HARD: 12노출+3미노출)
CREATE TABLE IF NOT EXISTS words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES daily_categories(id) ON DELETE CASCADE,
  word VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 점수 테이블
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL,
  nickname VARCHAR(20) NOT NULL,
  score INTEGER NOT NULL,
  time_ms INTEGER NOT NULL,
  missed_count INTEGER NOT NULL DEFAULT 0,
  mode VARCHAR(10) NOT NULL CHECK (mode IN ('basic', 'reverse')),
  difficulty VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_daily_categories_date ON daily_categories(date);
CREATE INDEX IF NOT EXISTS idx_words_category_id ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_scores_date ON scores(date);
CREATE INDEX IF NOT EXISTS idx_scores_guest_id ON scores(guest_id);
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);

-- Row Level Security
ALTER TABLE daily_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read daily_categories" ON daily_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read words" ON words FOR SELECT USING (true);
CREATE POLICY "Anyone can read scores" ON scores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert scores" ON scores FOR INSERT WITH CHECK (true);
