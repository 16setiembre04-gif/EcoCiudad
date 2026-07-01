import { type Report } from './report.entity';

export interface ReportComment {
  id: string;
  reportId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}

export interface ReportWithComments extends Report {
  comments: ReportComment[];
  timeline: ReportTimelineEntry[];
}

export interface ReportTimelineEntry {
  id: string;
  reportId: string;
  status: Report['status'];
  comment?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}
