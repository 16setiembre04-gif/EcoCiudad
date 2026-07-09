import {
  type Event,
  type EventCategory,
  type EventStatus,
  type EventParticipant,
  type ParticipantStatus,
  type EventAttendance,
  type EventReminder,
} from '../../domain/entities';
import {
  type EventDTO,
  type EventParticipantDTO,
  type EventAttendanceDTO,
  type EventReminderDTO,
} from '../dto';

export class EventMapper {
  static toDomain(dto: EventDTO): Event {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      startDate: new Date(dto.start_date),
      endDate: new Date(dto.end_date),
      location: {
        latitude: dto.latitude,
        longitude: dto.longitude,
        address: dto.address,
      },
      organizerId: dto.organizer_id,
      maxAttendees: dto.max_attendees,
      currentAttendees: dto.current_attendees,
      category: dto.category as EventCategory,
      status: (dto.status as EventStatus) || 'upcoming',
      imageUrl: dto.image_url,
      bannerUrl: dto.banner_url,
      ecoPointsReward: dto.eco_points_reward ?? 10,
      requirements: dto.requirements,
      communityId: dto.community_id,
      isVirtual: dto.is_virtual ?? false,
      meetingLink: dto.meeting_link,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: Event): EventDTO {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      start_date: entity.startDate.toISOString(),
      end_date: entity.endDate.toISOString(),
      latitude: entity.location.latitude,
      longitude: entity.location.longitude,
      address: entity.location.address ?? '',
      organizer_id: entity.organizerId,
      max_attendees: entity.maxAttendees,
      current_attendees: entity.currentAttendees,
      category: entity.category,
      status: entity.status,
      image_url: entity.imageUrl,
      banner_url: entity.bannerUrl,
      eco_points_reward: entity.ecoPointsReward,
      requirements: entity.requirements,
      community_id: entity.communityId,
      is_virtual: entity.isVirtual,
      meeting_link: entity.meetingLink,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}

export class EventParticipantMapper {
  static toDomain(dto: EventParticipantDTO): EventParticipant {
    return {
      id: dto.id,
      eventId: dto.event_id,
      userId: dto.user_id,
      status: dto.status as ParticipantStatus,
      registeredAt: new Date(dto.registered_at),
      attendedAt: dto.attended_at ? new Date(dto.attended_at) : undefined,
      reminderEnabled: dto.reminder_enabled,
      createdAt: new Date(dto.registered_at),
      updatedAt: new Date(dto.registered_at),
    };
  }

  static toDto(entity: EventParticipant): EventParticipantDTO {
    return {
      id: entity.id,
      event_id: entity.eventId,
      user_id: entity.userId,
      status: entity.status,
      registered_at: entity.registeredAt.toISOString(),
      attended_at: entity.attendedAt?.toISOString(),
      reminder_enabled: entity.reminderEnabled,
    };
  }
}

export class EventAttendanceMapper {
  static toDomain(dto: EventAttendanceDTO): EventAttendance {
    return {
      id: dto.id,
      eventId: dto.event_id,
      userId: dto.user_id,
      attendedAt: new Date(dto.attended_at),
      ecoPointsEarned: dto.eco_points_earned,
      certificateUrl: dto.certificate_url,
      qrCode: dto.qr_code,
    };
  }

  static toDto(entity: EventAttendance): EventAttendanceDTO {
    return {
      id: entity.id,
      event_id: entity.eventId,
      user_id: entity.userId,
      attended_at: entity.attendedAt.toISOString(),
      eco_points_earned: entity.ecoPointsEarned,
      certificate_url: entity.certificateUrl,
      qr_code: entity.qrCode,
    };
  }
}

export class EventReminderMapper {
  static toDomain(dto: EventReminderDTO): EventReminder {
    return {
      id: dto.id,
      eventId: dto.event_id,
      userId: dto.user_id,
      reminderBefore: dto.reminder_before,
      reminderType: dto.reminder_type as 'push' | 'email' | 'sms',
      sentAt: dto.sent_at ? new Date(dto.sent_at) : undefined,
      createdAt: new Date(dto.created_at),
    };
  }

  static toDto(entity: EventReminder): EventReminderDTO {
    return {
      id: entity.id,
      event_id: entity.eventId,
      user_id: entity.userId,
      reminder_before: entity.reminderBefore,
      reminder_type: entity.reminderType,
      sent_at: entity.sentAt?.toISOString(),
      created_at: entity.createdAt.toISOString(),
    };
  }
}
