import { type SupabaseClient } from '@supabase/supabase-js';
import { type UpdateProfileData, type UserDTO } from '../../dto';

export interface CitizenSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  district: string;
}

export class AuthRemoteDataSource {
  constructor(private readonly client: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<UserDTO> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user as unknown as UserDTO;
  }

  async signUp(email: string, password: string, displayName: string): Promise<UserDTO> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    return data.user as unknown as UserDTO;
  }

  async signUpCitizen(data: CitizenSignUpData): Promise<UserDTO> {
    const displayName = `${data.firstName} ${data.lastName}`;
    const { data: authData, error } = await this.client.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: displayName,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          department: data.department,
          district: data.district,
          role: 'citizen',
        },
      },
    });
    if (error) throw error;
    return authData.user as unknown as UserDTO;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser(): Promise<UserDTO | null> {
    const { data: { user } } = await this.client.auth.getUser();
    return user as unknown as UserDTO | null;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async updatePassword(newPassword: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const { error } = await this.client.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<UserDTO> {
    const { data: updated, error } = await this.client
      .from('profiles')
      .update({
        display_name: data.displayName,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        department: data.department,
        district: data.district,
        avatar_url: data.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return updated as unknown as UserDTO;
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }
}
