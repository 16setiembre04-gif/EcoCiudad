import { type User } from '../entities';
import { type DomainError } from '../errors';

export type Either<L, R> = { left: L; right?: undefined } | { left?: undefined; right: R };

export interface CitizenSignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  district: string;
}

export interface AuthRepository {
  signIn(email: string, password: string): Promise<Either<DomainError, User>>;
  signUp(email: string, password: string, displayName: string): Promise<Either<DomainError, User>>;
  signUpCitizen(data: CitizenSignUpData): Promise<Either<DomainError, User>>;
  signOut(): Promise<Either<DomainError, void>>;
  getCurrentUser(): Promise<Either<DomainError, User | null>>;
  resetPassword(email: string): Promise<Either<DomainError, void>>;
  updatePassword(newPassword: string): Promise<Either<DomainError, void>>;
  resendVerificationEmail(email: string): Promise<Either<DomainError, void>>;
}
