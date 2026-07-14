import { type SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/services/logger';
import { type ReportDTO, type ReportCommentDTO, type ReportTimelineEntryDTO } from '../../dto';

export class ReportRemoteDataSource {
  constructor(private readonly client: SupabaseClient) {}

  async getById(id: string): Promise<ReportDTO> {
    const { data, error } = await this.client
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }

  async getAll(filters?: Record<string, unknown>): Promise<ReportDTO[]> {
    let query = this.client.from('reports').select('*');

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.severity) query = query.eq('severity', filters.severity);
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const sortBy = (filters?.sortBy as string) ?? 'created_at';
    const sortOrder = (filters?.sortOrder as string) ?? 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    if (filters?.limit) {
      query = query.limit(filters.limit as number);
    }
    if (filters?.offset) {
      query = query.range(filters.offset as number, (filters.offset as number) + (filters.limit as number ?? 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as ReportDTO[];
  }

  async getMyReports(reporterId: string, filters?: Record<string, unknown>): Promise<ReportDTO[]> {
    let query = this.client
      .from('reports')
      .select('*')
      .eq('reporter_id', reporterId);

    if (filters?.category) query = query.eq('category', filters.category);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const sortBy = (filters?.sortBy as string) ?? 'created_at';
    const sortOrder = (filters?.sortOrder as string) ?? 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as unknown as ReportDTO[];
  }

  async create(report: Partial<ReportDTO>): Promise<ReportDTO> {
    const { data, error } = await this.client
      .from('reports')
      .insert(report)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ReportDTO;
  }

  async update(id: string, data: Partial<ReportDTO>): Promise<ReportDTO> {
    const { data: updated, error } = await this.client
      .from('reports')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated as unknown as ReportDTO;
  }

  async delete(id: string): Promise<void> {
    try {
      const { data: files } = await this.client.storage
        .from('report-images')
        .list(id, { limit: 100 });

      if (files && files.length > 0) {
        const paths = files.map((file) => `${id}/${file.name}`);
        const { error: removeError } = await this.client.storage
          .from('report-images')
          .remove(paths);
        if (removeError) {
          logger.error('[ReportDataSource] Error removing images:', removeError);
        }
      }
    } catch (cleanupError) {
      logger.error('[ReportDataSource] Error cleaning up images:', cleanupError);
    }

    const { error } = await this.client.from('reports').delete().eq('id', id);
    if (error) throw error;
  }

  async getComments(reportId: string): Promise<ReportCommentDTO[]> {
    const { data, error } = await this.client
      .from('report_comments')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as ReportCommentDTO[];
  }

  async addComment(comment: Partial<ReportCommentDTO>): Promise<ReportCommentDTO> {
    const { data, error } = await this.client
      .from('report_comments')
      .insert(comment)
      .select()
      .single();
    if (error) throw error;
    return data as unknown as ReportCommentDTO;
  }

  async getTimeline(reportId: string): Promise<ReportTimelineEntryDTO[]> {
    const { data, error } = await this.client
      .from('report_timeline')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as ReportTimelineEntryDTO[];
  }

  async uploadImage(reportId: string, uri: string): Promise<string> {
    const fileExt = uri.split('.').pop() || 'jpg';
    const fileName = `${reportId}/${Date.now()}.${fileExt}`;
    const contentType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    const fileBody = new FormData();
    fileBody.append('file', {
      uri,
      name: fileName,
      type: contentType,
    } as unknown as Blob);

    const { error } = await this.client.storage
      .from('report-images')
      .upload(fileName, fileBody);

    if (error) throw error;

    const { data } = this.client.storage
      .from('report-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  onReportChange(reportId: string, callback: (payload: unknown) => void) {
    return this.client
      .channel(`report-${reportId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports', filter: `id=eq.${reportId}` }, callback)
      .subscribe();
  }
}
