import { type Event, type EventParticipant, type EventAttendance, type EventReminder } from '../entities';
import { type DomainError } from '../errors';
import { type Either } from '../repositories/auth.repository';
import { type EventRepository, type EventFilters } from '../repositories/event.repository';

export class GetEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(filters?: EventFilters): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getAll(filters);
  }
}

export class GetEventByIdUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<Either<DomainError, Event>> {
    return this.eventRepository.getById(id);
  }
}

export class GetUpcomingEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(filters?: EventFilters): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getUpcoming(filters);
  }
}

export class GetNearbyEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(latitude: number, longitude: number, radiusKm?: number): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getNearby(latitude, longitude, radiusKm);
  }
}

export class GetPopularEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(limit?: number): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getPopular(limit);
  }
}

export class GetCommunityEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(communityId: string): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getCommunityEvents(communityId);
  }
}

export class GetMyEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(userId: string, status?: string): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getMyEvents(userId, status as any);
  }
}

export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'currentAttendees'>): Promise<Either<DomainError, Event>> {
    return this.eventRepository.create(event);
  }
}

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string, data: Partial<Event>): Promise<Either<DomainError, Event>> {
    return this.eventRepository.update(id, data);
  }
}

export class CancelEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: string): Promise<Either<DomainError, Event>> {
    return this.eventRepository.cancel(id);
  }
}

export class JoinEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, void>> {
    return this.eventRepository.joinEvent(eventId, userId);
  }
}

export class LeaveEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, void>> {
    return this.eventRepository.leaveEvent(eventId, userId);
  }
}

export class GetEventParticipantsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string): Promise<Either<DomainError, EventParticipant[]>> {
    return this.eventRepository.getParticipants(eventId);
  }
}

export class IsRegisteredUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    return this.eventRepository.isRegistered(eventId, userId);
  }
}

export class ToggleFavoriteUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    return this.eventRepository.toggleFavorite(eventId, userId);
  }
}

export class GetFavoritesUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(userId: string): Promise<Either<DomainError, Event[]>> {
    return this.eventRepository.getFavorites(userId);
  }
}

export class IsFavoriteUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, boolean>> {
    return this.eventRepository.isFavorite(eventId, userId);
  }
}

export class MarkAttendanceUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance>> {
    return this.eventRepository.markAttendance(eventId, userId);
  }
}

export class GetAttendanceUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, EventAttendance | null>> {
    return this.eventRepository.getAttendance(eventId, userId);
  }
}

export class SetReminderUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(
    eventId: string,
    userId: string,
    reminderBefore: number,
    reminderType: 'push' | 'email' | 'sms'
  ): Promise<Either<DomainError, EventReminder>> {
    return this.eventRepository.setReminder(eventId, userId, reminderBefore, reminderType);
  }
}

export class GetRemindersUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<Either<DomainError, EventReminder[]>> {
    return this.eventRepository.getReminders(eventId, userId);
  }
}

export class UploadEventImageUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(eventId: string, uri: string): Promise<Either<DomainError, string>> {
    return this.eventRepository.uploadImage(eventId, uri);
  }
}
