import { BaseEntity } from './base.entity';

export interface Event extends BaseEntity {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  organizerId: string;
  maxAttendees?: number;
  currentAttendees: number;
  category: EventCategory;
  imageUrl?: string;
  bannerUrl?: string;
  ecoPointsReward: number;
  requirements?: string[];
  communityId?: string;
  status: EventStatus;
  isVirtual: boolean;
  meetingLink?: string;
}

export type EventCategory = 'cleanup' | 'planting' | 'education' | 'community' | 'workshop';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventParticipant extends BaseEntity {
  eventId: string;
  userId: string;
  status: ParticipantStatus;
  registeredAt: Date;
  attendedAt?: Date;
  reminderEnabled: boolean;
}

export type ParticipantStatus = 'registered' | 'attended' | 'cancelled' | 'waitlisted';

export interface EventAttendance {
  id: string;
  eventId: string;
  userId: string;
  attendedAt: Date;
  ecoPointsEarned: number;
  certificateUrl?: string;
  qrCode?: string;
}

export interface EventReminder {
  id: string;
  eventId: string;
  userId: string;
  reminderBefore: number;
  reminderType: 'push' | 'email' | 'sms';
  sentAt?: Date;
  createdAt: Date;
}
