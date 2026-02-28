import type { Target, TargetAndTransition, Transition } from 'framer-motion';
import type { Difficulty } from '../../types';

export interface WordVariant {
  initial: Target;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
  transition: Transition;
  wrapperStyle?: React.CSSProperties;
  blankDurationMs: number;
  /**
   * true: 카드(흰 배경)를 고정하고 텍스트만 애니메이션.
   * false: 카드 전체가 애니메이션.
   */
  textOnly: boolean;
}

export const WORD_VARIANTS: Record<Difficulty, WordVariant> = {
  // EASY: 카드 전체 Y축 뒤집기
  easy: {
    textOnly: false,
    wrapperStyle: { perspective: '800px' },
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit:    { rotateY: -90, opacity: 0 },
    transition: { duration: 0.22, ease: 'easeOut' },
    blankDurationMs: 140,
  },
  // MEDIUM: 카드 전체 좌→우 슬라이드
  medium: {
    textOnly: false,
    initial: { x: 56, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit:    { x: -56, opacity: 0 },
    transition: { duration: 0.18, ease: 'easeOut' },
    blankDurationMs: 100,
  },
  // HARD: 카드 고정 + 텍스트만 아래→위 슬라이드
  // 흰 카드가 항상 화면에 있어 공백·깜빡임 없음
  hard: {
    textOnly: true,
    initial: { y: 22, opacity: 0 },
    animate: { y: 0,  opacity: 1 },
    exit:    { y: -22, opacity: 0 },
    transition: { duration: 0.1, ease: 'easeOut' },
    blankDurationMs: 50,
  },
};
