import { type Event, type EventParticipant, type EventAttendance, type EventReminder } from '../../domain/entities';
import { type DomainError } from '../../domain/errors';
import { type Either, type EventRepository, type EventFilters } from '../../domain/repositories';
import { type EventRemoteDataSource } from '../datasources/remote';
import { EventMapper, EventParticipantMapper, EventAttendanceMapper, EventReminderMapper } from '../mappers';
import { mapSupabaseErrorToDomainError } from '../../infrastructure/errors/supabase-error.mapper';

export class EventRepositoryImpl implements EventRepository {
  constructor(private readonly dataSource: EventRemoteDataSource) {}

  async getById(id: string): Promise<Either<DomainError, Event>> {
    try {
      const dto = await this.dataSource.getById(id);
      return { right: EventMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getAll(filters?: EventFilters): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getAll(filters as Record<string, unknown>);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getUpcoming(filters?: EventFilters): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getUpcoming(filters as Record<string, unknown>);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getNearby(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getNearby(latitude, longitude, radiusKm);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getPopular(limit?: number): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getPopular(limit);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getCommunityEvents(communityId: string): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getCommunityEvents(communityId);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getMyEvents(userId: string, status?: any): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getMyEvents(userId, status);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async create(
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>,
  ): Promise<Either<DomainError, Event>> {
    try {
      const dto = EventMapper.toDto(event as Event);
      const created = await this.dataSource.create(dto);
      return { right: EventMapper.toDomain(created) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async update(id: string, data: Partial<Event>): Promise<Either<DomainError, Event>> {
    try {
      const dto = EventMapper.toDto(data as Event);
      const updated = await this.dataSource.update(id, dto);
      return { right: EventMapper.toDomain(updated) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async cancel(id: string): Promise<Either<DomainError, Event>> {
    try {
      const updated = await this.dataSource.cancel(id);
      return { right: EventMapper.toDomain(updated) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async joinEvent(eventId: string, userId: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.joinEvent(eventId, userId);
      return { right: undefined };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async leaveEvent(eventId: string, userId: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.leaveEvent(eventId, userId);
      return { right: undefined };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getParticipants(eventId: string): Promise<Either<DomainError, EventParticipant[]>> {
    try {
      const dtos = await this.dataSource.getParticipants(eventId);
      return { right: dtos.map(EventParticipantMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async isRegistered(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await this.dataSource.isRegistered(eventId, userId);
      return { right: result };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async toggleFavorite(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await this.dataSource.toggleFavorite(eventId, userId);
      return { right: result };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getFavorites(userId: string): Promise<Either<DomainError, Event[]>> {
    try {
      const dtos = await this.dataSource.getFavorites(userId);
      return { right: dtos.map(EventMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async isFavorite(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    try {
      const result = await this.dataSource.isFavorite(eventId, userId);
      return { right: result };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async markAttendance(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance>> {
    try {
      const dto = await this.dataSource.markAttendance(eventId, userId);
      return { right: EventAttendanceMapper.toDomain(dto) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getAttendance(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance | null>> {
    try {
      const dto = await this.dataSource.getAttendance(eventId, userId);
      return { right: dto ? EventAttendanceMapper.toDomain(dto) : null };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async setReminder(
    eventId: string,
    userId: string,
    reminderBefore: number,
    reminderType: 'push' | 'email' | 'sms',
  ): Promise<Either<DomainError, EventReminder>> {
    try {
      const dto = await this.dataSource.setReminder(eventId, userId, reminderBefore, reminderType);
      return { right: EventReminderMapper.toDomain(dto) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async getReminders(eventId: string, userId: string): Promise<Either<DomainError, EventReminder[]>> {
    try {
      const dtos = await this.dataSource.getReminders(eventId, userId);
      return { right: dtos.map(EventReminderMapper.toDomain) };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async uploadImage(eventId: string, uri: string): Promise<Either<DomainError, string>> {
    try {
      const url = await this.dataSource.uploadImage(eventId, uri);
      return { right: url };
    }   catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }
}
