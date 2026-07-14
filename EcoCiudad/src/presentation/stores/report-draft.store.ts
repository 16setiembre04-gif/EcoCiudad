import { create } from 'zustand';
import { type GeoLocation, type ReportCategory, type ReportSeverity } from '@/domain/entities';

export interface ReportDraftState {
  title: string;
  description: string;
  category?: ReportCategory;
  severity: ReportSeverity;
  images: string[];
  location?: GeoLocation;
  isAnonymous: boolean;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategory: (category?: ReportCategory) => void;
  setSeverity: (severity: ReportSeverity) => void;
  setImages: (images: string[]) => void;
  addImage: (uri: string) => void;
  removeImage: (index: number) => void;
  setLocation: (location?: GeoLocation) => void;
  setIsAnonymous: (isAnonymous: boolean) => void;
  reset: () => void;
}

const initialState = {
  title: '',
  description: '',
  category: undefined as ReportCategory | undefined,
  severity: 'medium' as ReportSeverity,
  images: [] as string[],
  location: undefined as GeoLocation | undefined,
  isAnonymous: false,
};

export const useReportDraftStore = create<ReportDraftState>((set) => ({
  ...initialState,

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setCategory: (category) => set({ category }),
  setSeverity: (severity) => set({ severity }),
  setImages: (images) => set({ images }),
  addImage: (uri) => set((state) => ({ images: [...state.images, uri] })),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  setLocation: (location) => set({ location }),
  setIsAnonymous: (isAnonymous) => set({ isAnonymous }),
  reset: () => set(initialState),
}));
