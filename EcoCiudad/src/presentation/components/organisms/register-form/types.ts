import { type CitizenSignUpFormData } from '@/lib/validations';

export interface RegisterFormProps {
  onSubmit: (data: CitizenSignUpFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  accentColor?: string;
}
