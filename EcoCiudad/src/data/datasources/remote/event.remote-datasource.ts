import { type SupabaseClient } from '@supabase/supabase-js';
import {
  type EventDTO,
  type EventParticipantDTO,
  type EventAttendanceDTO,
  type EventReminderDTO,
} from '../../dto';

export class EventRemoteDataSource {
  constructor(private readonly client: SupabaseClient) {}

  async getById(id: string): Promise<EventDTO> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as EventDTO;
  }

  async getAll(filters?: Record<string, unknown>): Promise<EventDTO[]> {
    let query = this.client.from('events').select('*');
    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.communityId) query = query.eq('community_id', filters.communityId);
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    const { data, error } = await query.order('start_date', { ascending: true });
    if (error) throw error;
    return data as unknown as EventDTO[];
  }

  async getUpcoming(filters?: Record<string, unknown>): Promise<EventDTO[]> {
    let query = this.client
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .gte('start_date', new Date().toISOString());

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.communityId) query = query.eq('community_id', filters.communityId);

    const { data, error } = await query.order('start_date', { ascending: true }).limit(20);
    if (error) throw error;
    return data as unknown as EventDTO[];
  }

  async getNearby(latitude: number, longitude: number, radiusKm: number = 50): Promise<EventDTO[]> {
    const { data, error } = await this.client.rpc('get_nearby_events', {
      lat: latitude,
      lng: longitude,
      radius_km: radiusKm,
    });
    if (error) {
      const { data: fallback, error: fallbackError } = await this.client
        .from('events')
        .select('*')
        .eq('status', 'upcoming')
        .order('start_date', { ascending: true })
        .limit(20);
      if (fallbackError) throw fallbackError;
      return (fallback ?? []) as unknown as EventDTO[];
    }
    return (data ?? []) as unknown as EventDTO[];
  }

  async getPopular(limit: number = 10): Promise<EventDTO[]> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .order('current_attendees', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as EventDTO[];
  }

  async getCommunityEvents(communityId: string): Promise<EventDTO[]> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('community_id', communityId)
      .order('start_date', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as EventDTO[];
  }

  async getMyEvents(userId: string, status?: string): Promise<EventDTO[]> {
    let query = this.client
      .from('event_attendees')
      .select('event:events(*)')
      .eq('user_id', userId)
      .eq('status', 'registered');

    if (status) {
      query = query.eq('event.status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data ?? []) as any[]).map((item: any) => item.event).filter(Boolean) as unknown as EventDTO[];
  }

  async create(event: Partial<EventDTO>): Promise<EventDTO> {
    const { data, error } = await this.client
      .from('events')
      .insert(event)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as EventDTO;
  }

  async update(id: string, data: Partial<EventDTO>): Promise<EventDTO> {
    const { data: updated, error } = await this.client
      .from('events')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated as unknown as EventDTO;
  }

  async cancel(id: string): Promise<EventDTO> {
    return this.update(id, { status: 'cancelled' } as Partial<EventDTO>);
  }

  async joinEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from('event_attendees')
      .insert({
        event_id: eventId,
        user_id: userId,
        status: 'registered',
        reminder_enabled: true,
      });
    if (error) throw error;
  }

  async leaveEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await this.client
      .from('event_attendees')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);
    if (error) throw error;
  }

  async getParticipants(eventId: string): Promise<EventParticipantDTO[]> {
    const { data, error } = await this.client
      .from('event_attendees')
      .select('*, user:profiles(id, display_name, avatar_url)')
      .eq('event_id', eventId)
      .order('registered_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as EventParticipantDTO[];
  }

  async isRegistered(eventId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('event_attendees')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .eq('status', 'registered')
      .single();
    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }

  async toggleFavorite(eventId: string, userId: string): Promise<boolean> {
    const isFav = await this.isFavorite(eventId, userId);
    if (isFav) {
      const { error } = await this.client
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('target_id', eventId)
        .eq('target_type', 'event');
      if (error) throw error;
      return false;
    } else {
      const { error } = await this.client
        .from('favorites')
        .insert({
          user_id: userId,
          target_id: eventId,
          target_type: 'event',
        });
      if (error) throw error;
      return true;
    }
  }

  async getFavorites(userId: string): Promise<EventDTO[]> {
    const { data, error } = await this.client
      .from('favorites')
      .select('target_id')
      .eq('user_id', userId)
      .eq('target_type', 'event');
    if (error) throw error;

    const eventIds = (data ?? []).map((f: any) => f.target_id);
    if (eventIds.length === 0) return [];

    const { data: events, error: eventsError } = await this.client
      .from('events')
      .select('*')
      .in('id', eventIds);
    if (eventsError) throw eventsError;
    return (events ?? []) as unknown as EventDTO[];
  }

  async isFavorite(eventId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.client
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('target_id', eventId)
      .eq('target_type', 'event')
      .single();
    if (error && error.code === 'PGRST116') return false;
    if (error) throw error;
    return !!data;
  }

  async markAttendance(eventId: string, userId: string): Promise<EventAttendanceDTO> {
    const { data, error } = await this.client
      .from('event_attendees')
      .update({ status: 'attended', attended_at: new Date().toISOString() })
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .select()
      .single();
    if (error) throw error;

    const event = await this.getById(eventId);
    const attendance: EventAttendanceDTO = {
      id: data.id,
      event_id: eventId,
      user_id: userId,
      attended_at: data.attended_at,
      eco_points_earned: event.eco_points_reward ?? 10,
    };

    await this.client.from('eco_points_transactions').insert({
      user_id: userId,
      amount: attendance.eco_points_earned,
      type: 'earn',
      reason: `Attended event: ${event.title}`,
      reference_type: 'event',
      reference_id: eventId,
      balance_after: 0,
    });

    return attendance;
  }

  async getAttendance(eventId: string, userId: string): Promise<EventAttendanceDTO | null> {
    const { data, error } = await this.client
      .from('event_attendees')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .eq('status', 'attended')
      .single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    if (!data) return null;

    const event = await this.getById(eventId);
    return {
      id: data.id,
      event_id: eventId,
      user_id: userId,
      attended_at: data.attended_at,
      eco_points_earned: event.eco_points_reward ?? 10,
    } as EventAttendanceDTO;
  }

  async setReminder(
    eventId: string,
    userId: string,
    reminderBefore: number,
    reminderType: string,
  ): Promise<EventReminderDTO> {
    const { data: existing, error: checkError } = await this.client
      .from('event_reminders')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .eq('reminder_before', reminderBefore)
      .eq('reminder_type', reminderType)
      .single();

    if (!checkError && existing) {
      return existing as unknown as EventReminderDTO;
    }

    const { data, error } = await this.client
      .from('event_reminders')
      .insert({
        event_id: eventId,
        user_id: userId,
        reminder_before: reminderBefore,
        reminder_type: reminderType,
      })
      .select()
      .single();
    if (error) throw error;
    return data as unknown as EventReminderDTO;
  }

  async getReminders(eventId: string, userId: string): Promise<EventReminderDTO[]> {
    const { data, error } = await this.client
      .from('event_reminders')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', userId);
    if (error) throw error;
    return (data ?? []) as unknown as EventReminderDTO[];
  }

  onEventChange(eventId: string, callback: (payload: unknown) => void) {
    return this.client
      .channel(`event-${eventId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events', filter: `id=eq.${eventId}` },
        callback,
      )
      .subscribe();
  }
}
