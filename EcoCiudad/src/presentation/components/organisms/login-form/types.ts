import { type SignInFormData } from '@/lib/validations';

export interface LoginFormProps {
  onSubmit: (data: SignInFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  showRememberMe?: boolean;
  accentColor?: string;
}
