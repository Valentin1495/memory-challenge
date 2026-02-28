import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Word, Difficulty } from '../../types';
import { WORD_VARIANTS } from './wordAnimations';

interface ReviewModalProps {
  isOpen: boolean;
  words: Word[];
  wordDurationMs: number;
  difficulty: Difficulty;
  onClose: () => void;
  penaltyPoints: number;
}

export function ReviewModal({ isOpen, words, wordDurationMs, difficulty, onClose, penaltyPoints }: ReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWord, setShowWord] = useState(false);
  const [started, setStarted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const variants = WORD_VARIANTS[difficulty];

  useEffect(() => {
    if (!isOpen) return;
    setCurrentIndex(0);
    setShowWord(false);
    setStarted(false);
    const id = setTimeout(() => { setStarted(true); setShowWord(true); }, 300);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !started) return;
    if (showWord) {
      const id = setTimeout(() => setShowWord(false), wordDurationMs);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        const next = currentIndex + 1;
        if (next >= words.length) {
          onCloseRef.current();
        } else {
          setCurrentIndex(next);
          setShowWord(true);
        }
      }, variants.blankDurationMs);
      return () => clearTimeout(id);
    }
  }, [isOpen, started, showWord, currentIndex, words.length, wordDurationMs, variants.blankDurationMs]);

  const progress = started
    ? ((currentIndex + (showWord ? 0.5 : 1)) / words.length) * 100
    : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <div className="w-full px-4 py-4 flex justify-between items-center">
            <span className="text-white/70 text-sm">다시 보기</span>
            <span className="text-red-300 text-sm font-medium">-{penaltyPoints}점</span>
          </div>

          <div className="w-full max-w-xs px-4 mb-10">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15 }}
              />
            </div>
          </div>

          <div
            className="relative flex items-center justify-center w-72 h-44"
            style={variants.wrapperStyle}
          >
            <AnimatePresence mode="wait">

              {/* HARD: 카드 고정 + 텍스트만 슬라이드 */}
              {variants.textOnly && (
                <motion.div
                  key="hard-review-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white rounded-3xl shadow-2xl w-full h-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      {showWord && (
                        <motion.span
                          key={`review-word-${currentIndex}`}
                          initial={variants.initial}
                          animate={variants.animate}
                          exit={variants.exit}
                          transition={variants.transition}
                          className="text-5xl font-bold text-gray-800 tracking-tight"
                        >
                          {words[currentIndex]?.word}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* EASY/MEDIUM: 카드 전체 애니메이션 */}
              {!variants.textOnly && showWord && (
                <motion.div
                  key={`review-word-${currentIndex}`}
                  initial={variants.initial}
                  animate={variants.animate}
                  exit={variants.exit}
                  transition={variants.transition}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white rounded-3xl shadow-2xl w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-bold text-gray-800 tracking-tight">
                      {words[currentIndex]?.word}
                    </span>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <p className="mt-10 text-white/50 text-sm">
            {currentIndex + 1} / {words.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
