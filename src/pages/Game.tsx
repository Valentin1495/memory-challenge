import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useTimer } from '../hooks/useTimer';
import { useGameStore } from '../store/gameStore';
import { DIFFICULTY_CONFIG } from '../types';
import { WordDisplay } from '../components/game/WordDisplay';
import { ChoiceGrid } from '../components/game/ChoiceGrid';
import { Timer } from '../components/game/Timer';
import { ReviewModal } from '../components/game/ReviewModal';

export function Game() {
  const navigate = useNavigate();
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
    showReviewModal,
    handleWordSelect,
    handleReviewRequest,
    handleCloseReview,
  } = useGame();

  const { difficulty, setPhase } = useGameStore();
  const config = DIFFICULTY_CONFIG[difficulty];
  const timer = useTimer();

  useEffect(() => {
    if (phase === 'home') navigate('/');
    if (phase === 'result') {
      timer.stop();
      navigate('/result');
    }
  }, [phase, navigate, timer]);

  useEffect(() => {
    if (phase === 'choose' && !timer.isRunning) {
      timer.start();
    }
  }, [phase, timer]);

  const handleWordClick = (wordId: string) => {
    const result = handleWordSelect(wordId);
    if (result.isComplete) timer.stop();
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">로딩 중...</p>
      </div>
    );
  }

  const targetCount = mode === 'basic' ? shownWords.length : config.decoyCount;
  const progress = (correctSelections.length / targetCount) * 100;
  const livesRemaining = config.maxLives - wrongCount;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={() => { timer.stop(); navigate('/'); }}
          className="text-white/80 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-white/60 text-sm">{category.name}</p>
          <p className="text-white font-medium">
            {mode === 'basic' ? '기본' : '리버스'} ·{' '}
            {difficulty === 'easy' ? '🟢' : difficulty === 'medium' ? '🟡' : '🔴'}
          </p>
        </div>

        {phase === 'choose' ? (
          <Timer formattedTime={timer.formattedTime} isRunning={timer.isRunning} />
        ) : (
          <div className="w-20" />
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {phase === 'memorize' && (
          <WordDisplay
            words={shownWords}
            wordDurationMs={config.wordDurationMs}
            difficulty={difficulty}
            onComplete={() => setPhase('choose')}
          />
        )}

        {phase === 'choose' && (
          <div className="flex-1 flex flex-col">
            {/* 목숨 + 진행 바 */}
            <div className="px-4 py-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">
                  {mode === 'basic' ? '기억나는 단어를 모두 선택하세요' : '보지 않았던 단어를 선택하세요'}
                </span>
                <span className="text-white/80 text-sm">{correctSelections.length} / {targetCount}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-400 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* 목숨 + 다시보기 */}
            <div className="flex justify-center gap-4 px-4 py-2">
              {/* 목숨 표시 */}
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
                {Array.from({ length: config.maxLives }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={false}
                    animate={{ scale: i < livesRemaining ? 1 : 0.6, opacity: i < livesRemaining ? 1 : 0.3 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="text-base"
                  >
                    ❤️
                  </motion.span>
                ))}
              </div>

              {/* 다시 보기 */}
              <motion.button
                onClick={handleReviewRequest}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-1.5 text-white text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                다시 보기
                {reviewCount > 0 && (
                  <span className="text-white/60">({reviewCount})</span>
                )}
              </motion.button>
            </div>

            <div className="flex-1 flex items-center">
              <ChoiceGrid
                words={allWords}
                selectedWords={selectedWords}
                correctSelections={correctSelections}
                mode={mode}
                onSelect={handleWordClick}
              />
            </div>
          </div>
        )}
      </main>

      <ReviewModal
        isOpen={showReviewModal}
        words={shownWords}
        wordDurationMs={config.wordDurationMs}
        difficulty={difficulty}
        onClose={handleCloseReview}
        penaltyPoints={150}
      />
    </div>
  );
}
