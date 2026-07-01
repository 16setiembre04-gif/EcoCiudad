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
  created_at: string;
  updated_at: string;
}
