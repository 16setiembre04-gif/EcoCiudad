import { type ForgotPasswordFormData } from '@/lib/validations';

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}
