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
    title: 'Reporta Problemas Ambientales',
    description: 'Toma una foto y reporta problemas ambientales en tu área. Ayuda a mantener nuestra ciudad limpia y verde.',
  },
  {
    id: 'community',
    icon: 'community',
    title: 'Únete a tu Comunidad',
    description: 'Conéctate con vecinos, únete a iniciativas locales y trabajen juntos por un mejor medio ambiente.',
  },
  {
    id: 'recycle',
    icon: 'recycle',
    title: 'Recicla y Gana Eco Puntos',
    description: 'Registra tus esfuerzos de reciclaje, gana puntos y desbloquea recompensas por tus contribuciones ambientales.',
  },
];
