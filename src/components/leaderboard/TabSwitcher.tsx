import { motion } from 'framer-motion';

type Period = 'daily' | 'weekly';

interface TabSwitcherProps {
  currentPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function TabSwitcher({ currentPeriod, onPeriodChange }: TabSwitcherProps) {
  const tabs: { id: Period; label: string }[] = [
    { id: 'daily', label: '오늘' },
    { id: 'weekly', label: '이번 주' },
  ];

  return (
    <div className="flex bg-white/20 rounded-full p-1 w-fit mx-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onPeriodChange(tab.id)}
          className={`
            relative px-6 py-2 rounded-full text-sm font-medium transition-colors
            ${currentPeriod === tab.id ? 'text-purple-700' : 'text-white/80 hover:text-white'}
          `}
        >
          {currentPeriod === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
