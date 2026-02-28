import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGameStore } from '../store/gameStore';
import { DIFFICULTY_CONFIG } from '../types';

export function Result() {
  const navigate = useNavigate();
  const store = useGameStore();
  const { mode, category, nickname, wrongCount, reviewCount, getScore, missedWordsSnapshot, isSuccess, resetGame } = store;
  const { submitScore } = useLeaderboard({ period: 'daily' });
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const hasSubmitted = useRef(false);

  const score = getScore();
  const missedWords = missedWordsSnapshot;
  const timeMs = store.startTime && store.endTime ? store.endTime - store.startTime : 0;

  useEffect(() => {
    if (!store.endTime) {
      navigate('/');
      return;
    }
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    setSubmitState('submitting');
    submitScore(nickname, score, timeMs, wrongCount, mode, store.difficulty).then((success) => {
      setSubmitState(success ? 'done' : 'error');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  const formatTime = (ms: number) => `${(ms / 1000).toFixed(1)}초`;

  const getScoreEmoji = (s: number) => {
    if (s >= 700) return '👏';
    if (s >= 400) return '👍';
    return '💪';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <span className="text-6xl">{isSuccess ? '🏆' : getScoreEmoji(score)}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        {/* 성공/실패 배너 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center justify-center gap-2 rounded-2xl py-3 mb-5 ${isSuccess
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
            }`}
        >
          <span className="text-xl">{isSuccess ? '✅' : '❌'}</span>
          <span className="font-bold text-lg">{isSuccess ? '성공!' : '실패'}</span>
          {!isSuccess && (
            <span className="text-sm text-red-500 ml-1">오답 초과로 게임 종료</span>
          )}
        </motion.div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">게임 결과</h2>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">최종 점수</p>
          <p className="text-5xl font-bold text-purple-600">{score.toLocaleString()}</p>
          {mode === 'reverse' && (
            <p className="text-sm text-purple-400 mt-1">
              리버스 보너스 ×{DIFFICULTY_CONFIG[store.difficulty].reverseMultiplier} 적용
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">소요 시간</p>
            <p className="text-lg font-semibold text-gray-800">{formatTime(timeMs)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">오답</p>
            <p className="text-lg font-semibold text-red-500">{wrongCount}회</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">다시보기</p>
            <p className="text-lg font-semibold text-orange-500">{reviewCount}회</p>
          </div>
        </div>

        {isSuccess === false && missedWords.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">
              선택하지 못한 단어 ({missedWords.length}개)
            </p>
            <div className="flex flex-wrap gap-2">
              {missedWords.map((word) => (
                <span key={word.id} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm">
                  {word.word}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500 mb-6">
          <p>카테고리: {category?.name}</p>
          <p>
            {mode === 'basic' ? '기본' : '리버스'} ·{' '}
            {store.difficulty === 'easy' ? '🟢 EASY' : store.difficulty === 'medium' ? '🟡 MEDIUM' : '🔴 HARD'}
          </p>
        </div>

        {/* 자동 등록 상태 표시 */}
        <div className="mb-4">
          {submitState === 'submitting' && (
            <p className="text-center text-sm text-gray-400">점수 등록 중...</p>
          )}
          {submitState === 'done' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-green-600 font-medium"
            >
              ✓ 리더보드에 등록되었습니다
            </motion.p>
          )}
          {submitState === 'error' && (
            <p className="text-center text-sm text-red-400">등록에 실패했습니다</p>
          )}
        </div>

        <div className="space-y-3">
          <motion.button
            onClick={() => navigate('/leaderboard')}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            리더보드 보기
          </motion.button>

          <button
            onClick={handlePlayAgain}
            className="w-full py-3 border-2 border-purple-500 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
          >
            다시 플레이
          </button>
        </div>
      </motion.div>
    </div>
  );
}
