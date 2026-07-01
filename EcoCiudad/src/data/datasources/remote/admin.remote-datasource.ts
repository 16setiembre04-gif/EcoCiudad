import { type SupabaseClient } from '@supabase/supabase-js';
import {
  type DashboardStatsDTO,
  type ActivityDataDTO,
  type ReportsByCategoryDTO,
  type ReportsByDistrictDTO,
  type AdminActivityLogDTO,
  type SystemSettingsDTO,
} from '../../dto';

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
}
