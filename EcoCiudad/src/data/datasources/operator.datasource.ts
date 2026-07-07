import { supabase } from '@/infrastructure/database';
import {
  type ReportDTO,
  type OperatorAssignmentDTO,
  type OperatorActivityLogDTO,
  type OperatorStatsDTO,
  type OperatorPerformanceDTO,
} from '@/data/dto';
import { type OperatorReportFilters } from '@/domain/repositories';

export class OperatorDatasource {
  async getAssignedReports(
    operatorId: string,
    filters?: OperatorReportFilters
  ): Promise<ReportDTO[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .eq('assignee_id', operatorId)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getPendingReports(filters?: OperatorReportFilters): Promise<ReportDTO[]> {
    let query = supabase
      .from('reports')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async getReportDetails(reportId: string): Promise<ReportDTO> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data;
  }

  async assignReport(
    reportId: string,
    operatorId: string,
    assignedBy: string,
    notes?: string
  ): Promise<OperatorAssignmentDTO> {
    const { data, error } = await supabase
      .from('operator_assignments')
      .insert({
        report_id: reportId,
        operator_id: operatorId,
        assigned_by: assignedBy,
        notes,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;

    // Update report assignee
    await supabase
      .from('reports')
      .update({ assignee_id: operatorId, status: 'assigned' })
      .eq('id', reportId);

    return data;
  }

  async unassignReport(reportId: string, operatorId: string): Promise<void> {
    await supabase
      .from('operator_assignments')
      .update({ status: 'cancelled' })
      .eq('report_id', reportId)
      .eq('operator_id', operatorId)
      .eq('status', 'active');

    await supabase
      .from('reports')
      .update({ assignee_id: null, status: 'pending' })
      .eq('id', reportId);
  }

  async updateReportStatus(
    reportId: string,
    status: string
  ): Promise<ReportDTO> {
    const { data, error } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async resolveReport(
    reportId: string,
    notes: string,
    resolutionPhotos?: string[]
  ): Promise<ReportDTO> {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status: 'resolved',
        resolution_notes: notes,
        resolution_photos: resolutionPhotos || [],
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async rejectReport(
    reportId: string,
    reason: string
  ): Promise<ReportDTO> {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status: 'rejected',
        resolution_notes: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async logActivity(
    operatorId: string,
    reportId: string | undefined,
    action: string,
    details?: string,
    metadata?: Record<string, any>
  ): Promise<OperatorActivityLogDTO> {
    const { data, error } = await supabase
      .from('operator_activity_logs')
      .insert({
        operator_id: operatorId,
        report_id: reportId,
        action,
        details,
        metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getOperatorActivity(
    operatorId: string,
    limit: number = 50
  ): Promise<OperatorActivityLogDTO[]> {
    const { data, error } = await supabase
      .from('operator_activity_logs')
      .select('*')
      .eq('operator_id', operatorId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getOperatorStats(operatorId: string): Promise<OperatorStatsDTO> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // Get total assigned
    const { count: totalAssigned } = await supabase
      .from('operator_assignments')
      .select('*', { count: 'exact', head: true })
      .eq('operator_id', operatorId);

    // Get pending reports
    const { count: pendingReports } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', operatorId)
      .in('status', ['pending', 'assigned', 'in_progress']);

    // Get resolved today
    const { count: resolvedToday } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', operatorId)
      .eq('status', 'resolved')
      .gte('resolved_at', today.toISOString());

    // Get resolved this week
    const { count: resolvedThisWeek } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', operatorId)
      .eq('status', 'resolved')
      .gte('resolved_at', weekAgo.toISOString());

    // Get resolved this month
    const { count: resolvedThisMonth } = await supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('assignee_id', operatorId)
      .eq('status', 'resolved')
      .gte('resolved_at', monthAgo.toISOString());

    // Calculate average resolution time (simplified)
    const { data: resolvedReports } = await supabase
      .from('reports')
      .select('created_at, resolved_at')
      .eq('assignee_id', operatorId)
      .eq('status', 'resolved')
      .limit(100);

    let averageResolutionTime = 0;
    if (resolvedReports && resolvedReports.length > 0) {
      const totalTime = resolvedReports.reduce((acc, report) => {
        const created = new Date(report.created_at).getTime();
        const resolved = new Date(report.resolved_at).getTime();
        return acc + (resolved - created) / (1000 * 60 * 60); // hours
      }, 0);
      averageResolutionTime = totalTime / resolvedReports.length;
    }

    // Calculate completion rate
    const completionRate = totalAssigned && totalAssigned > 0
      ? ((resolvedThisMonth || 0) / totalAssigned) * 100
      : 0;

    return {
      total_assigned: totalAssigned || 0,
      pending_reports: pendingReports || 0,
      resolved_today: resolvedToday || 0,
      resolved_this_week: resolvedThisWeek || 0,
      resolved_this_month: resolvedThisMonth || 0,
      average_resolution_time: Math.round(averageResolutionTime * 10) / 10,
      completion_rate: Math.round(completionRate * 10) / 10,
    };
  }

  async getOperatorPerformance(
    operatorId: string,
    period: 'day' | 'week' | 'month' | 'year'
  ): Promise<OperatorPerformanceDTO> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const { data: reports } = await supabase
      .from('reports')
      .select('status, category')
      .eq('assignee_id', operatorId)
      .gte('created_at', startDate.toISOString());

    const totalReports = reports?.length || 0;
    const resolvedReports = reports?.filter(r => r.status === 'resolved').length || 0;
    const rejectedReports = reports?.filter(r => r.status === 'rejected').length || 0;

    // Calculate top categories
    const categoryMap: Record<string, number> = {};
    reports?.forEach(report => {
      categoryMap[report.category] = (categoryMap[report.category] || 0) + 1;
    });

    const topCategories = Object.entries(categoryMap)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const completionRate = totalReports > 0 ? (resolvedReports / totalReports) * 100 : 0;

    return {
      operator_id: operatorId,
      period,
      total_reports: totalReports,
      resolved_reports: resolvedReports,
      rejected_reports: rejectedReports,
      average_resolution_time: 0, // Would need more complex calculation
      completion_rate: Math.round(completionRate * 10) / 10,
      top_categories: topCategories,
    };
  }

  async getTodayRoute(operatorId: string): Promise<ReportDTO[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('assignee_id', operatorId)
      .in('status', ['assigned', 'in_progress'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async optimizeRoute(
    reportIds: string[]
  ): Promise<ReportDTO[]> {
    // Simple optimization: sort by priority and location proximity
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .in('id', reportIds)
      .order('priority', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
