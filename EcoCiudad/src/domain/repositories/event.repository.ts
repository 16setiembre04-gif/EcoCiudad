import { type Event, type EventCategory, type EventStatus, type EventParticipant, type EventAttendance, type EventReminder, type ParticipantStatus } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from './auth.repository';

export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  startDate?: Date;
  endDate?: Date;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  search?: string;
  communityId?: string;
}

export interface EventRepository {
  getById(id: string): Promise<Either<DomainError, Event>>;
  getAll(filters?: EventFilters): Promise<Either<DomainError, Event[]>>;
  getUpcoming(filters?: EventFilters): Promise<Either<DomainError, Event[]>>;
  getNearby(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, Event[]>>;
  getPopular(limit?: number): Promise<Either<DomainError, Event[]>>;
  getCommunityEvents(communityId: string): Promise<Either<DomainError, Event[]>>;
  getMyEvents(userId: string, status?: EventStatus): Promise<Either<DomainError, Event[]>>;
  create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<Either<DomainError, Event>>;
  update(id: string, data: Partial<Event>): Promise<Either<DomainError, Event>>;
  cancel(id: string): Promise<Either<DomainError, Event>>;
  joinEvent(eventId: string, userId: string): Promise<Either<DomainError, void>>;
  leaveEvent(eventId: string, userId: string): Promise<Either<DomainError, void>>;
  getParticipants(eventId: string): Promise<Either<DomainError, EventParticipant[]>>;
  isRegistered(eventId: string, userId: string): Promise<Either<DomainError, boolean>>;
  toggleFavorite(eventId: string, userId: string): Promise<Either<DomainError, boolean>>;
  getFavorites(userId: string): Promise<Either<DomainError, Event[]>>;
  isFavorite(eventId: string, userId: string): Promise<Either<DomainError, boolean>>;
  markAttendance(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance>>;
  getAttendance(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance | null>>;
  setReminder(eventId: string, userId: string, reminderBefore: number, reminderType: 'push' | 'email' | 'sms'): Promise<Either<DomainError, EventReminder>>;
  getReminders(eventId: string, userId: string): Promise<Either<DomainError, EventReminder[]>>;
}
