import { type SupabaseClient } from '@supabase/supabase-js';
import {
  type DashboardStatsDTO,
  type ActivityDataDTO,
  type ReportsByCategoryDTO,
  type ReportsByDistrictDTO,
  type AdminActivityLogDTO,
  type SystemSettingsDTO,
  type UserDTO,
  type ReportDTO,
} from '../../dto';
import { type AdminFilters, type ReportFilters } from '../../../domain/repositories/admin.repository';

export class AdminRemoteDataSource {
  constructor(private readonly client: SupabaseClient) {}

  async getDashboardStats(): Promise<DashboardStatsDTO> {
    const { data, error } = await this.client
      .from('admin_dashboard_stats')
      .select('*')
      .single();
    if (error) throw error;
    return data as unknown as DashboardStatsDTO;
  }

  async getActivityData(
    startDate?: Date,
    endDate?: Date,
    groupBy?: 'day' | 'week' | 'month'
  ): Promise<ActivityDataDTO[]> {
    const { data, error } = await this.client.rpc('get_admin_activity_data', {
      p_start_date: startDate?.toISOString() ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      p_end_date: endDate?.toISOString() ?? new Date().toISOString(),
      p_group_by: groupBy ?? 'day',
    });
    if (error) throw error;
    return (data ?? []) as unknown as ActivityDataDTO[];
  }

  async getReportsByCategory(): Promise<ReportsByCategoryDTO[]> {
    const { data, error } = await this.client.rpc('get_reports_by_category');
    if (error) throw error;
    return (data ?? []) as unknown as ReportsByCategoryDTO[];
  }

  async getReportsByDistrict(): Promise<ReportsByDistrictDTO[]> {
    const { data, error } = await this.client.rpc('get_reports_by_district');
    if (error) throw error;
    return (data ?? []) as unknown as ReportsByDistrictDTO[];
  }

  async getActivityLogs(
    filters?: {
      adminId?: string;
      action?: string;
      entityType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<AdminActivityLogDTO[]> {
    let query = this.client
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.adminId) query = query.eq('admin_id', filters.adminId);
    if (filters?.action) query = query.eq('action', filters.action);
    if (filters?.entityType) query = query.eq('entity_type', filters.entityType);
    if (filters?.startDate) query = query.gte('created_at', filters.startDate.toISOString());
    if (filters?.endDate) query = query.lte('created_at', filters.endDate.toISOString());
    if (filters?.limit) query = query.limit(filters.limit);
    if (filters?.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as AdminActivityLogDTO[];
  }

  async logActivity(
    activity: Omit<AdminActivityLogDTO, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AdminActivityLogDTO> {
    const { data, error } = await this.client
      .from('admin_activity_logs')
      .insert(activity)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as AdminActivityLogDTO;
  }

  async getSettings(): Promise<SystemSettingsDTO[]> {
    const { data, error } = await this.client
      .from('system_settings')
      .select('*')
      .order('key');
    if (error) throw error;
    return (data ?? []) as unknown as SystemSettingsDTO[];
  }

  async updateSetting(key: string, value: unknown): Promise<SystemSettingsDTO> {
    const { data, error } = await this.client
      .from('system_settings')
      .update({ value: value as never })
      .eq('key', key)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as SystemSettingsDTO;
  }

  // Users Management Methods
  async getUsers(filters?: AdminFilters): Promise<UserDTO[]> {
    let query = this.client
      .from('profiles')
      .select('*');

    if (filters?.search) {
      query = query.or(`display_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
    }
    if (filters?.role) {
      query = query.eq('role', filters.role);
    }
    if (filters?.isActive !== undefined) {
      query = query.eq('is_active', filters.isActive);
    }

    const sortBy = filters?.sortBy ?? 'created_at';
    const sortOrder = filters?.sortOrder ?? 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as UserDTO[];
  }

  async getUserById(id: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async updateUser(id: string, data: Partial<UserDTO>): Promise<UserDTO> {
    const { data: updated, error } = await this.client
      .from('profiles')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated as unknown as UserDTO;
  }

  async activateUser(id: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async deactivateUser(id: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async suspendUser(id: string, reason: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .update({
        is_active: false,
        suspension_reason: reason,
        suspended_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async restoreUser(id: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .update({
        is_active: true,
        suspension_reason: null,
        suspended_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async deleteUser(id: string): Promise<void> {
    const { error } = await this.client
      .from('profiles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async assignRole(id: string, role: string): Promise<UserDTO> {
    const { data, error } = await this.client
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as UserDTO;
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    const { error } = await this.client.auth.admin.updateUserById(id, {
      password: newPassword,
    });
    if (error) throw error;
  }

  async getUserStatistics(userId: string): Promise<{
    reportCount: number;
    eventCount: number;
    communityCount: number;
    ecoPoints: number;
  }> {
    const [reports, events, communities, profile] = await Promise.all([
      this.client.from('reports').select('*', { count: 'exact', head: true }).eq('reporter_id', userId),
      this.client.from('event_attendees').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      this.client.from('community_members').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      this.client.from('profiles').select('eco_points').eq('id', userId).single(),
    ]);

    return {
      reportCount: reports.count ?? 0,
      eventCount: events.count ?? 0,
      communityCount: communities.count ?? 0,
      ecoPoints: (profile.data as any)?.eco_points ?? 0,
    };
  }

  // Reports Management Methods
  async getReports(filters?: ReportFilters): Promise<ReportDTO[]> {
    let query = this.client
      .from('reports')
      .select('*');

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.district) {
      query = query.eq('address', filters.district);
    }
    if (filters?.assigneeId) {
      query = query.eq('assignee_id', filters.assigneeId);
    }
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    const sortBy = filters?.sortBy ?? 'created_at';
    const sortOrder = filters?.sortOrder ?? 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as ReportDTO[];
  }

  async getReportById(id: string): Promise<ReportDTO> {
    const { data, error } = await this.client
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }

  async assignReport(reportId: string, operatorId: string): Promise<ReportDTO> {
    const { data, error } = await this.client
      .from('reports')
      .update({ 
        assignee_id: operatorId,
        status: 'in_review',
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }

  async updateReportStatus(reportId: string, status: string): Promise<ReportDTO> {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { data, error } = await this.client
      .from('reports')
      .update(updateData)
      .eq('id', reportId)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }

  async updateReportPriority(reportId: string, priority: string): Promise<ReportDTO> {
    const { data, error } = await this.client
      .from('reports')
      .update({ 
        priority,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }
}
