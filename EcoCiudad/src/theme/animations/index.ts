export const animations = {
  duration: {
    fast: 200,
    normal: 250,
    slow: 300,
    toast: 400,
  },
  easing: {
    easeOut: [0.0, 0.0, 0.2, 1.0] as [number, number, number, number],
    easeInOut: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
    spring: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
  },
} as const;

export type AnimationDuration = keyof typeof animations.duration;
