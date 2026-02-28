import { motion } from 'framer-motion';

interface TimerProps {
  formattedTime: string;
  isRunning: boolean;
}

export function Timer({ formattedTime, isRunning }: TimerProps) {
  return (
    <motion.div
      className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2"
      animate={isRunning ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1 }}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-white font-mono text-lg font-semibold">
        {formattedTime}
      </span>
    </motion.div>
  );
}
