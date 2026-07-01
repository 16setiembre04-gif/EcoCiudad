import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  category: z.enum(['waste', 'pollution', 'green_space', 'water', 'noise', 'other']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
  images: z.array(z.string()).max(5),
});

export type ReportFormData = z.infer<typeof reportSchema>;
