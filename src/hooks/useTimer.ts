import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useTimer(options: UseTimerOptions = {}) {
  const { autoStart = false, onComplete } = options;
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    onComplete?.();
  }, [onComplete]);

  const reset = useCallback(() => {
    setElapsedMs(0);
    setIsRunning(false);
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          setElapsedMs(Date.now() - startTimeRef.current);
        }
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`;
    }
    return `${seconds}.${tenths}초`;
  }, []);

  return {
    elapsedMs,
    isRunning,
    start,
    stop,
    reset,
    formattedTime: formatTime(elapsedMs),
    getStartTime: () => startTimeRef.current,
  };
}
