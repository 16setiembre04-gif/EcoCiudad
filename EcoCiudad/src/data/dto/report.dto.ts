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
  priority?: string | number;
  resolution_notes?: string;
  resolution_photos?: string[];
  estimated_completion?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReportCommentDTO {
  id: string;
  report_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface ReportTimelineEntryDTO {
  id: string;
  report_id: string;
  status: string;
  comment?: string;
  author_id: string;
  author_name: string;
  created_at: string;
}
