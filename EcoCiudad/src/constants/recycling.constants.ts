export const RECYCLING_MATERIALS = {
  plastic: { label: 'Plástico', icon: 'recycle' as const, color: '#3B82F6' },
  paper: { label: 'Papel', icon: 'recycle' as const, color: '#8B5CF6' },
  glass: { label: 'Vidrio', icon: 'recycle' as const, color: '#06B6D4' },
  metal: { label: 'Metal', icon: 'recycle' as const, color: '#6B7280' },
  electronics: { label: 'Electrónicos', icon: 'recycle' as const, color: '#EF4444' },
  organic: { label: 'Orgánico', icon: 'recycle' as const, color: '#22C55E' },
  textile: { label: 'Textil', icon: 'recycle' as const, color: '#F59E0B' },
  battery: { label: 'Baterías', icon: 'recycle' as const, color: '#DC2626' },
} as const;

export const RECYCLING_CENTER_STATUS = {
  open: { label: 'Abierto', color: '#22C55E' },
  closed: { label: 'Cerrado', color: '#EF4444' },
  closingSoon: { label: 'Cierra Pronto', color: '#F59E0B' },
} as const;

export const RECYCLING_CONSTANTS = {
  DEFAULT_RADIUS_KM: 10,
  MAX_RADIUS_KM: 50,
  MIN_RATING: 1,
  MAX_RATING: 5,
  MAX_REVIEW_LENGTH: 500,
  MAX_IMAGES_PER_REVIEW: 3,
} as const;

export const RECYCLING_ROUTES = {
  HOME: '/(citizen)/(tabs)/recycling',
  DETAILS: '/(citizen)/recycling/[id]',
  MAP: '/(citizen)/recycling/map',
  FAVORITES: '/(citizen)/recycling/favorites',
} as const;
