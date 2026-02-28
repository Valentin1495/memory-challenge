import { useState, useEffect, useCallback } from 'react';
import { supabase, getGuestId } from '../lib/supabase';
import type { LeaderboardEntry, GameMode, Difficulty } from '../types';

type Period = 'daily' | 'weekly';

interface UseLeaderboardOptions {
  period: Period;
  mode?: GameMode;
  difficulty?: Difficulty;
}

export function useLeaderboard({ period, mode, difficulty }: UseLeaderboardOptions) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [myScore, setMyScore] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const now = new Date();
      let startDate: string;

      if (period === 'daily') {
        // 오늘 날짜 (로컬 기준) — 자정에 자동 리셋
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        startDate = `${y}-${m}-${d}`;
      } else {
        // 이번 주 월요일 0시 기준 — 매주 월요일 리셋
        const day = now.getDay(); // 0=일, 1=월, ..., 6=토
        const daysFromMonday = day === 0 ? 6 : day - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysFromMonday);
        const y = monday.getFullYear();
        const m = String(monday.getMonth() + 1).padStart(2, '0');
        const d = String(monday.getDate()).padStart(2, '0');
        startDate = `${y}-${m}-${d}`;
      }

      let query = supabase
        .from('scores')
        .select('*')
        .gte('date', startDate)
        .order('score', { ascending: false })
        .order('time_ms', { ascending: true })
        .order('created_at', { ascending: true })
        .limit(1000);

      if (mode) {
        query = query.eq('mode', mode);
      }
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data: rawData, error: fetchError } = await query;

      // guest_id별 최고 점수 1개만 유지 (이미 score DESC 정렬이므로 첫 등장이 베스트)
      const seenGuests = new Set<string>();
      const data = (rawData || []).filter((entry: { guest_id: string }) => {
        if (seenGuests.has(entry.guest_id)) return false;
        seenGuests.add(entry.guest_id);
        return true;
      }).slice(0, 100);

      if (fetchError) {
        throw fetchError;
      }

      const guestId = getGuestId();

      const leaderboardEntries: LeaderboardEntry[] = (data || []).map((entry: {
        guest_id: string;
        nickname: string;
        score: number;
        time_ms: number;
        missed_count: number;
        mode: GameMode;
        difficulty: Difficulty;
      }, index: number) => ({
        rank: index + 1,
        nickname: entry.nickname,
        score: entry.score,
        timeMs: entry.time_ms,
        wrongCount: entry.missed_count ?? 0,
        mode: entry.mode,
        difficulty: entry.difficulty,
        isMe: entry.guest_id === guestId,
      }));

      setEntries(leaderboardEntries);
      setTotalCount((data || []).length);

      const myBestEntry = leaderboardEntries.find(e => e.isMe);
      if (myBestEntry) {
        setMyRank(myBestEntry.rank);
        setMyScore(myBestEntry.score);
      } else {
        setMyRank(null);
        setMyScore(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '리더보드를 불러오는데 실패했습니다');
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [period, mode, difficulty]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const submitScore = useCallback(async (
    nickname: string,
    score: number,
    timeMs: number,
    wrongCount: number,
    gameMode: GameMode,
    difficulty: Difficulty
  ) => {
    try {
      const guestId = getGuestId();
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const { error: submitError } = await supabase
        .from('scores')
        .insert({
          guest_id: guestId,
          nickname,
          score,
          time_ms: timeMs,
          missed_count: wrongCount,
          mode: gameMode,
          difficulty,
          date: today,
        });

      if (submitError) {
        throw submitError;
      }

      await fetchLeaderboard();
      return true;
    } catch (err) {
      console.error('Failed to submit score:', err);
      return false;
    }
  }, [fetchLeaderboard]);

  return {
    entries,
    isLoading,
    error,
    myRank,
    myScore,
    totalCount,
    refetch: fetchLeaderboard,
    submitScore,
  };
}
