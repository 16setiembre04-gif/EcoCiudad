import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres').max(100, 'El título no puede exceder 100 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(500, 'La descripción no puede exceder 500 caracteres'),
  category: z.enum(['waste', 'pollution', 'green_space', 'water', 'noise', 'other']),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().optional(),
  images: z.array(z.string()).max(5, 'Puedes subir máximo 5 imágenes'),
});

export type ReportFormData = z.infer<typeof reportSchema>;
