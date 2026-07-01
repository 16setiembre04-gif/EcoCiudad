import { create } from 'zustand';
import { type ReportFilters } from '../../domain/repositories';
import { type EventFilters } from '../../domain/repositories';

interface FilterState {
  reportFilters: ReportFilters;
  eventFilters: EventFilters;
  setReportFilters: (filters: ReportFilters) => void;
  setEventFilters: (filters: EventFilters) => void;
  resetReportFilters: () => void;
  resetEventFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  reportFilters: {},
  eventFilters: {},
  setReportFilters: (filters) => set({ reportFilters: filters }),
  setEventFilters: (filters) => set({ eventFilters: filters }),
  resetReportFilters: () => set({ reportFilters: {} }),
  resetEventFilters: () => set({ eventFilters: {} }),
}));
