import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGame } from '../hooks/useGame';
import { useGameStore } from '../store/gameStore';
import { DIFFICULTY_CONFIG } from '../types';
import type { GameMode, Difficulty } from '../types';

const DIFFICULTY_META = {
  easy: {
    label: 'EASY',
    emoji: '🟢',
    color: 'border-green-400 bg-green-50',
    activeColor: 'border-green-500 bg-green-100 ring-2 ring-green-300',
    textColor: 'text-green-700',
    description: '생각보다 할 만한데?',
  },
  medium: {
    label: 'MEDIUM',
    emoji: '🟡',
    color: 'border-yellow-400 bg-yellow-50',
    activeColor: 'border-yellow-500 bg-yellow-100 ring-2 ring-yellow-300',
    textColor: 'text-yellow-700',
    description: '집중 안 하면 틀린다',
  },
  hard: {
    label: 'HARD',
    emoji: '🔴',
    color: 'border-red-400 bg-red-50',
    activeColor: 'border-red-500 bg-red-100 ring-2 ring-red-300',
    textColor: 'text-red-700',
    description: '와 이건 빡세다',
  },
} as const;

export function Home() {
  const navigate = useNavigate();
  const { isLoading, category, nickname, setNickname, setMode, handleStartMemorize } = useGame();
  const { difficulty, setDifficulty } = useGameStore();
  const [inputNickname, setInputNickname] = useState(nickname);
  const [selectedMode, setSelectedMode] = useState<GameMode>('basic');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(difficulty);
  const [showNicknameInput, setShowNicknameInput] = useState(!nickname);

  const handleStart = () => {
    if (!inputNickname.trim()) {
      setShowNicknameInput(true);
      return;
    }
    setNickname(inputNickname.trim());
    setMode(selectedMode);
    setDifficulty(selectedDifficulty);
    handleStartMemorize();
    navigate('/game');
  };

  const config = DIFFICULTY_CONFIG[selectedDifficulty];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl font-bold text-white mb-2">기억력 챌린지</h1>
        <p className="text-white/70">하루 1분, 두뇌 트레이닝</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        {/* 오늘의 카테고리 */}
        <div className="text-center mb-5">
          <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
            오늘의 카테고리
          </span>
          <h2 className="text-2xl font-bold text-gray-800">{category?.name || '로딩 중...'}</h2>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* 닉네임 */}
        {showNicknameInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
            <input
              type="text"
              value={inputNickname}
              onChange={(e) => setInputNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setShowNicknameInput(false)}
              placeholder="닉네임을 입력하세요"
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </motion.div>
        ) : (
          <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <span className="text-gray-600">
              안녕하세요, <span className="font-semibold text-gray-800">{inputNickname || nickname}</span>님!
            </span>
            <button
              onClick={() => setShowNicknameInput(true)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              변경
            </button>
          </div>
        )}

        {/* 모드 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">모드</label>
          <div className="grid grid-cols-2 gap-2">
            {(['basic', 'reverse'] as GameMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedMode === m
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <p className="font-semibold text-gray-800 text-sm">
                  {m === 'basic' ? '기본' : '리버스'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {m === 'basic' ? '봤던 단어 고르기' : '안 봤던 단어 고르기'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 선택 */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((d) => {
              const meta = DIFFICULTY_META[d];
              const isSelected = selectedDifficulty === d;
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    isSelected ? meta.activeColor : `${meta.color} opacity-70 hover:opacity-100`
                  }`}
                >
                  <p className="text-lg">{meta.emoji}</p>
                  <p className={`text-xs font-bold mt-0.5 ${meta.textColor}`}>{meta.label}</p>
                </button>
              );
            })}
          </div>

          {/* 선택된 난이도 정보 */}
          <motion.div
            key={`${selectedDifficulty}-${selectedMode}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-gray-50 rounded-xl px-4 py-3"
          >
            <p className={`text-sm font-medium mb-2 ${DIFFICULTY_META[selectedDifficulty].textColor}`}>
              "{DIFFICULTY_META[selectedDifficulty].description}"
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>단어 노출</span>
              <span className="text-gray-700 font-medium">
                {config.shownCount}개 · {config.wordDurationMs / 1000}초
              </span>
              <span>선택지</span>
              <span className="text-gray-700 font-medium">
                {config.shownCount + config.decoyCount}개
                {selectedMode === 'reverse' && (
                  <span className="text-gray-400">
                    {' '}(정답 {config.decoyCount}개)
                  </span>
                )}
              </span>
              <span>목숨</span>
              <span className="text-gray-700 font-medium">
                {'❤️'.repeat(config.maxLives)}
              </span>
              {selectedMode === 'reverse' && (
                <>
                  <span>점수 배율</span>
                  <span className="font-bold text-purple-600">
                    ×{config.reverseMultiplier}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* 시작 버튼 */}
        <motion.button
          onClick={handleStart}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          게임 시작
        </motion.button>

        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full mt-3 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors"
        >
          리더보드 보기
        </button>
      </motion.div>
    </div>
  );
}
