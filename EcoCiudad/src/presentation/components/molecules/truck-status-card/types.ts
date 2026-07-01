import { type ViewStyle } from 'react-native';

export interface TruckStatusCardProps {
  plateNumber: string;
  status: 'available' | 'in-route' | 'maintenance' | 'offline';
  operatorName: string;
  location?: string;
  currentLoad?: number;
  capacity?: number;
  lastUpdate?: string;
  onPress?: () => void;
  containerStyle?: ViewStyle;
  testID?: string;
}
