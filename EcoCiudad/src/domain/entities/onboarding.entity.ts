import { type IconName } from '@/presentation/components/atoms/icon';

export interface OnboardingScreen {
  id: string;
  icon: IconName;
  title: string;
  description: string;
}

export const onboardingScreens: OnboardingScreen[] = [
  {
    id: 'report',
    icon: 'error',
    title: 'Report Environmental Issues',
    description: 'Snap a photo and report environmental problems in your area. Help keep our city clean and green.',
  },
  {
    id: 'community',
    icon: 'community',
    title: 'Join Your Community',
    description: 'Connect with neighbors, join local initiatives, and work together for a better environment.',
  },
  {
    id: 'recycle',
    icon: 'recycle',
    title: 'Recycle and Earn Eco Points',
    description: 'Track your recycling efforts, earn points, and unlock rewards for your environmental contributions.',
  },
];
