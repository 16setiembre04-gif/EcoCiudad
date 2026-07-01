import { type ViewStyle } from 'react-native';
import { type ReportCategory, type ReportStatus, type ReportSeverity } from '@/domain/entities';

export interface ReportFiltersProps {
  selectedCategory?: ReportCategory;
  selectedStatus?: ReportStatus;
  selectedSeverity?: ReportSeverity;
  onCategoryChange?: (category: ReportCategory | undefined) => void;
  onStatusChange?: (status: ReportStatus | undefined) => void;
  onSeverityChange?: (severity: ReportSeverity | undefined) => void;
  onClearFilters?: () => void;
  style?: ViewStyle;
}
