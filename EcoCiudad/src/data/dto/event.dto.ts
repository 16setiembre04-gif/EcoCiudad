export interface EventDTO {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  latitude: number;
  longitude: number;
  address: string;
  organizer_id: string;
  max_attendees?: number;
  current_attendees: number;
  category: string;
  status: string;
  image_url?: string;
  banner_url?: string;
  eco_points_reward: number;
  requirements?: string[];
  community_id?: string;
  is_virtual: boolean;
  meeting_link?: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipantDTO {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  registered_at: string;
  attended_at?: string;
  reminder_enabled: boolean;
  user?: {
    id: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface EventAttendanceDTO {
  id: string;
  event_id: string;
  user_id: string;
  attended_at: string;
  eco_points_earned: number;
  certificate_url?: string;
  qr_code?: string;
}

export interface EventReminderDTO {
  id: string;
  event_id: string;
  user_id: string;
  reminder_before: number;
  reminder_type: string;
  sent_at?: string;
  created_at: string;
}

export interface EventFavoriteDTO {
  id: string;
  event_id: string;
  user_id: string;
  created_at: string;
}
