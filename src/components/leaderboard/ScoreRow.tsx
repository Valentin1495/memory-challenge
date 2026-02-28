import { motion } from 'framer-motion';
import type { LeaderboardEntry } from '../../types';

interface ScoreRowProps {
  entry: LeaderboardEntry;
  isCurrentUser?: boolean;
  index: number;
}

export function ScoreRow({ entry, isCurrentUser = false, index }: ScoreRowProps) {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-2xl">🥇</span>;
      case 2:
        return <span className="text-2xl">🥈</span>;
      case 3:
        return <span className="text-2xl">🥉</span>;
      default:
        return (
          <span className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-sm font-bold text-gray-600">
            {rank}
          </span>
        );
    }
  };

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}초`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`
        flex items-center gap-4 p-4 rounded-xl
        ${isCurrentUser ? 'bg-purple-100 border-2 border-purple-400' : 'bg-white/80'}
      `}
    >
      <div className="flex-shrink-0 w-10">
        {getRankBadge(entry.rank)}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isCurrentUser ? 'text-purple-700' : 'text-gray-800'}`}>
          {entry.nickname}
          {isCurrentUser && <span className="ml-2 text-xs text-purple-500">(나)</span>}
        </p>
        <p className="text-sm text-gray-500">{formatTime(entry.timeMs)}</p>
      </div>

      <div className="flex-shrink-0 text-right">
        <p className={`text-lg font-bold ${isCurrentUser ? 'text-purple-700' : 'text-gray-800'}`}>
          {entry.score.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">점</p>
      </div>
    </motion.div>
  );
}
