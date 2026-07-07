import { supabase } from '@/infrastructure/database';
import { type User, type UserRole } from '@/domain/entities';
import {
  AuthenticationError,
  UnexpectedError,
} from '@/domain/errors';
import { type Either } from '@/domain/repositories';
import { logger } from '@/services/logger';

export interface SignUpParams {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface CitizenSignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  district: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async signUp(params: SignUpParams): Promise<Either<AuthenticationError | UnexpectedError, User>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            display_name: params.displayName,
            role: params.role,
          },
        },
      });

      if (error) {
        logger.error('Sign up failed', error.message);
        return { left: new AuthenticationError({ message: error.message }) };
      }

      if (!data.user) {
        return { left: new UnexpectedError() };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName: params.displayName,
        role: params.role,
        isEmailVerified: data.user.email_confirmed_at !== null,
        createdAt: new Date(data.user.created_at ?? Date.now()),
        updatedAt: new Date(data.user.updated_at ?? Date.now()),
      };

      logger.info('User signed up successfully', { userId: user.id, role: user.role });
      return { right: user };
    } catch (error) {
      logger.error('Sign up error', error);
      return { left: new UnexpectedError() };
    }
  }

  async signUpCitizen(params: CitizenSignUpParams): Promise<Either<AuthenticationError | UnexpectedError, User>> {
    try {
      const displayName = `${params.firstName} ${params.lastName}`;
      const { data, error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            display_name: displayName,
            first_name: params.firstName,
            last_name: params.lastName,
            phone: params.phone,
            department: params.department,
            district: params.district,
            role: 'citizen',
          },
        },
      });

      if (error) {
        logger.error('Citizen sign up failed', error.message);
        return { left: new AuthenticationError({ message: error.message }) };
      }

      if (!data.user) {
        return { left: new UnexpectedError() };
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email!,
        displayName,
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        department: params.department,
        district: params.district,
        role: 'citizen',
        isEmailVerified: data.user.email_confirmed_at !== null,
        createdAt: new Date(data.user.created_at ?? Date.now()),
        updatedAt: new Date(data.user.updated_at ?? Date.now()),
      };

      logger.info('Citizen signed up successfully', { userId: user.id });
      return { right: user };
    } catch (error) {
      logger.error('Citizen sign up error', error);
      return { left: new UnexpectedError() };
    }
  }

  async signIn(params: SignInParams): Promise<Either<AuthenticationError | UnexpectedError, User>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        logger.error('Sign in failed', error.message);
        if (error.message.includes('Invalid login credentials')) {
          return { left: new AuthenticationError({ message: 'Invalid email or password' }) };
        }
        if (error.message.includes('Email not confirmed')) {
          return { left: new AuthenticationError({ message: 'Please verify your email before signing in' }) };
        }
        return { left: new AuthenticationError({ message: error.message }) };
      }

      if (!data.user) {
        return { left: new UnexpectedError() };
      }

      const profile = await this.getProfile(data.user.id);
      if (profile.left) {
        return { left: profile.left };
      }

      logger.info('User signed in successfully', { userId: data.user.id });
      return { right: profile.right! };
    } catch (error) {
      logger.error('Sign in error', error);
      return { left: new UnexpectedError() };
    }
  }

  async signOut(): Promise<Either<UnexpectedError, void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        logger.error('Sign out failed', error.message);
        return { left: new UnexpectedError() };
      }
      logger.info('User signed out successfully');
      return { right: undefined };
    } catch (error) {
      logger.error('Sign out error', error);
      return { left: new UnexpectedError() };
    }
  }

  async getCurrentUser(): Promise<Either<UnexpectedError, User | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        logger.error('Get current user failed', error.message);
        return { left: new UnexpectedError() };
      }

      if (!user) {
        return { right: null };
      }

      const profile = await this.getProfile(user.id);
      if (profile.left) {
        return { left: profile.left };
      }

      return { right: profile.right! };
    } catch (error) {
      logger.error('Get current user error', error);
      return { left: new UnexpectedError() };
    }
  }

  async resetPassword(email: string): Promise<Either<AuthenticationError | UnexpectedError, void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'ecociudad://reset-password',
      });

      if (error) {
        logger.error('Reset password failed', error.message);
        return { left: new AuthenticationError({ message: error.message }) };
      }

      logger.info('Password reset email sent', { email });
      return { right: undefined };
    } catch (error) {
      logger.error('Reset password error', error);
      return { left: new UnexpectedError() };
    }
  }

  async updatePassword(newPassword: string): Promise<Either<AuthenticationError | UnexpectedError, void>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        logger.error('Update password failed', error.message);
        return { left: new AuthenticationError({ message: error.message }) };
      }

      logger.info('Password updated successfully');
      return { right: undefined };
    } catch (error) {
      logger.error('Update password error', error);
      return { left: new UnexpectedError() };
    }
  }

  async resendVerificationEmail(email: string): Promise<Either<AuthenticationError | UnexpectedError, void>> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        logger.error('Resend verification email failed', error.message);
        return { left: new AuthenticationError({ message: error.message }) };
      }

      logger.info('Verification email resent', { email });
      return { right: undefined };
    } catch (error) {
      logger.error('Resend verification email error', error);
      return { left: new UnexpectedError() };
    }
  }

  async getSession(): Promise<Either<UnexpectedError, AuthSession | null>> {
    logger.info('[AuthService] getSession() called');
    
    try {
      logger.info('[AuthService] Calling supabase.auth.getSession()');
      const { data: { session }, error } = await supabase.auth.getSession();
      logger.info('[AuthService] supabase.auth.getSession() resolved', { hasSession: !!session, error: error?.message });

      if (error) {
        logger.error('[AuthService] Get session failed', error.message);
        return { left: new UnexpectedError() };
      }

      if (!session) {
        logger.info('[AuthService] No active session found');
        return { right: null };
      }

      logger.info('[AuthService] Session found, getting profile for user:', session.user.id);
      const profile = await this.getProfile(session.user.id);
      logger.info('[AuthService] getProfile() resolved', { hasProfile: !!profile.right });
      
      if (profile.left) {
        logger.error('[AuthService] Failed to get profile');
        return { left: profile.left };
      }

      logger.info('[AuthService] Session and profile loaded successfully');
      return {
        right: {
          user: profile.right!,
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        },
      };
    } catch (error) {
      logger.error('[AuthService] Get session error', error);
      return { left: new UnexpectedError() };
    }
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    logger.info('[AuthService] onAuthStateChange() called, setting up listener');
    
    const result = supabase.auth.onAuthStateChange((event, session) => {
      logger.info('[AuthService] Auth state change event:', event);
      callback(event, session);
    });
    
    logger.info('[AuthService] onAuthStateChange() listener setup complete');
    return result;
  }

  private async getProfile(userId: string): Promise<Either<UnexpectedError, User>> {
    try {
      logger.info('[AuthService] Getting profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        logger.error('[AuthService] Get profile failed', error?.message);
        return { left: new UnexpectedError() };
      }

      logger.info('[AuthService] Profile loaded successfully', { displayName: data.display_name });
      const user: User = {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        department: data.department,
        district: data.district,
        avatarUrl: data.avatar_url,
        role: data.role as UserRole,
        isEmailVerified: data.is_email_verified,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      return { right: user };
    } catch (error) {
      logger.error('[AuthService] Get profile error', error);
      return { left: new UnexpectedError() };
    }
  }
}

export const authService = new AuthService();
