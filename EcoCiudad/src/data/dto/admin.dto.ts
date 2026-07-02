export interface DashboardStatsDTO {
  total_users: number;
  total_citizens: number;
  total_operators: number;
  total_admins: number;
  total_communities: number;
  total_events: number;
  upcoming_events: number;
  total_reports: number;
  resolved_reports: number;
  pending_reports: number;
  in_progress_reports: number;
  rejected_reports: number;
  total_recycling_centers: number;
  total_achievements: number;
  eco_points_distributed: number;
}

export interface ActivityDataDTO {
  date: string;
  reports: number;
  users: number;
  events: number;
  communities: number;
}

export interface ReportsByCategoryDTO {
  category: string;
  count: number;
  percentage: number;
}

export interface ReportsByDistrictDTO {
  district: string;
  count: number;
  percentage: number;
}

export interface AdminActivityLogDTO {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SystemSettingsDTO {
  id: string;
  key: string;
  value: unknown;
  type: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserDTO {
  id: string;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  department?: string;
  district?: string;
  avatar_url?: string;
  role: string;
  is_email_verified: boolean;
  is_active: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  eco_points: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface ReportDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  severity?: string;
  is_anonymous?: boolean;
  latitude: number;
  longitude: number;
  address?: string;
  images: string[];
  reporter_id: string;
  assignee_id?: string;
  priority?: string;
  resolution_notes?: string;
  resolution_photos?: string[];
  estimated_completion?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}
