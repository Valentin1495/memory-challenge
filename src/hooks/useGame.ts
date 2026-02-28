import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';
import type { DailyCategory } from '../types';

// 데모 데이터: 15개 과일 (난이도에 따라 클라이언트에서 랜덤 분배)
const DEMO_CATEGORY: DailyCategory = {
  id: '1',
  date: new Date().toISOString().split('T')[0],
  name: '과일',
  words: [
    { id: '1',  word: '사과' },
    { id: '2',  word: '바나나' },
    { id: '3',  word: '포도' },
    { id: '4',  word: '수박' },
    { id: '5',  word: '딸기' },
    { id: '6',  word: '오렌지' },
    { id: '7',  word: '키위' },
    { id: '8',  word: '망고' },
    { id: '9',  word: '복숭아' },
    { id: '10', word: '체리' },
    { id: '11', word: '레몬' },
    { id: '12', word: '자두' },
    { id: '13', word: '메론' },
    { id: '14', word: '파인애플' },
    { id: '15', word: '블루베리' },
  ],
};

export function useGame() {
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const {
    phase,
    mode,
    category,
    shownWords,
    allWords,
    selectedWords,
    correctSelections,
    wrongCount,
    reviewCount,
    nickname,
    setPhase,
    setMode,
    setCategory,
    setNickname,
    startGame,
    selectWord,
    useReview,
    resetGame,
    getScore,
    getMissedWords,
  } = useGameStore();

  const fetchTodayCategory = useCallback(async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: categoryData, error: categoryError } = await supabase
        .from('daily_categories')
        .select('*')
        .eq('date', today)
        .single();

      if (categoryError || !categoryData) {
        setCategory(DEMO_CATEGORY);
        setIsLoading(false);
        return;
      }

      const { data: wordsData, error: wordsError } = await supabase
        .from('words')
        .select('id, word')
        .eq('category_id', categoryData.id);

      if (wordsError || !wordsData) {
        setCategory(DEMO_CATEGORY);
        setIsLoading(false);
        return;
      }

      setCategory({
        id: categoryData.id,
        date: categoryData.date,
        name: categoryData.name,
        words: wordsData.map((w: { id: string; word: string }) => ({
          id: w.id,
          word: w.word,
        })),
      });
    } catch {
      setCategory(DEMO_CATEGORY);
    } finally {
      setIsLoading(false);
    }
  }, [setCategory]);

  useEffect(() => {
    fetchTodayCategory();
  }, [fetchTodayCategory]);

  const handleStartMemorize = useCallback(() => {
    startGame();
  }, [startGame]);

  const handleWordSelect = useCallback((wordId: string) => {
    return selectWord(wordId);
  }, [selectWord]);

  const handleReviewRequest = useCallback(() => {
    setShowReviewModal(true);
    useReview();
  }, [useReview]);

  const handleCloseReview = useCallback(() => {
    setShowReviewModal(false);
  }, []);

  return {
    isLoading,
    phase,
    mode,
    category,
    shownWords,
    allWords,
    selectedWords,
    correctSelections,
    wrongCount,
    reviewCount,
    nickname,
    showReviewModal,

    setMode,
    setNickname,
    handleStartMemorize,
    handleWordSelect,
    handleReviewRequest,
    handleCloseReview,
    resetGame,
    getScore,
    getMissedWords,
    setPhase,
  };
}
