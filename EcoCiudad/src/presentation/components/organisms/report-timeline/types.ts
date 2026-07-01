import { type ViewStyle } from 'react-native';
import { type ReportTimelineEntry } from '@/domain/entities';

export interface ReportTimelineProps {
  entries: ReportTimelineEntry[];
  currentStatus: string;
  style?: ViewStyle;
}
