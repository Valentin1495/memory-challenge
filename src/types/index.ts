export type GameMode = 'basic' | 'reverse';

export type GamePhase = 'home' | 'memorize' | 'choose' | 'result';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  shownCount: number;        // 암기 단계에서 보여주는 단어 수
  wordDurationMs: number;    // 단어 1개 표시 시간(ms)
  decoyCount: number;        // 선택지에 섞이는 안 보여준 단어 수 (리버스 모드의 정답 개수)
  maxLives: number;          // 허용 오답 횟수 (목숨)
  reverseMultiplier: number; // 리버스 모드 점수 배율
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    shownCount: 8,
    wordDurationMs: 1000,
    decoyCount: 2,
    maxLives: 3,
    reverseMultiplier: 1.2,
  },
  medium: {
    shownCount: 10,
    wordDurationMs: 700,
    decoyCount: 2,
    maxLives: 2,
    reverseMultiplier: 1.4,
  },
  hard: {
    shownCount: 12,
    wordDurationMs: 500,
    decoyCount: 3,
    maxLives: 1,
    reverseMultiplier: 1.6,
  },
};

export interface Word {
  id: string;
  word: string;
  /** 런타임에 난이도에 따라 결정됨. DB에는 저장하지 않음. */
  notShown: boolean;
}

export interface DailyCategory {
  id: string;
  date: string;
  name: string;
  /** DB에서 가져온 원본 단어 목록 (notShown 미설정) */
  words: Omit<Word, 'notShown'>[];
}

export interface ScoreRecord {
  id: string;
  guestId: string;
  nickname: string;
  score: number;
  timeMs: number;
  missedCount: number;
  mode: GameMode;
  difficulty: Difficulty;
  date: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  nickname: string;
  score: number;
  timeMs: number;
  wrongCount: number;
  mode: GameMode;
  difficulty: Difficulty;
  isMe: boolean;
}
