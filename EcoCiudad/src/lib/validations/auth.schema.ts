import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    role: z.enum(['citizen', 'operator', 'admin']),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const citizenSignUpSchema = z
  .object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    phone: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres').max(15, 'El teléfono es demasiado largo'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
    department: z.string().min(1, 'El departamento es requerido'),
    district: z.string().min(1, 'El distrito es requerido'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type CitizenSignUpFormData = z.infer<typeof citizenSignUpSchema>;

export const operatorSignUpSchema = z
  .object({
    displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    employeeId: z.string().min(3, 'El ID de empleado debe tener al menos 3 caracteres'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type OperatorSignUpFormData = z.infer<typeof operatorSignUpSchema>;
