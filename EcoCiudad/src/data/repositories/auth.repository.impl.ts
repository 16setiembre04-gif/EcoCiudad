import { type User } from '../../domain/entities';
import { type DomainError, UnexpectedError } from '../../domain/errors';
import { type AuthRepository, type Either, type CitizenSignUpData, type UpdateProfileData } from '../../domain/repositories';
import { type AuthRemoteDataSource } from '../datasources/remote';
import { UserMapper } from '../mappers';
import { mapSupabaseErrorToDomainError } from '../../infrastructure/errors/supabase-error.mapper';

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly dataSource: AuthRemoteDataSource) {}

  async signIn(email: string, password: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.signIn(email, password);
      return { right: UserMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.signUp(email, password, displayName);
      return { right: UserMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async signUpCitizen(data: CitizenSignUpData): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.signUpCitizen(data);
      return { right: UserMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }

  async signOut(): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.signOut();
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async getCurrentUser(): Promise<Either<DomainError, User | null>> {
    try {
      const dto = await this.dataSource.getCurrentUser();
      return { right: dto ? UserMapper.toDomain(dto) : null };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async resetPassword(email: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.resetPassword(email);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updatePassword(newPassword: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.updatePassword(newPassword);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async resendVerificationEmail(email: string): Promise<Either<DomainError, void>> {
    try {
      await this.dataSource.resendVerificationEmail(email);
      return { right: undefined };
    } catch {
      return { left: new UnexpectedError() };
    }
  }

  async updateProfile(userId: string, data: UpdateProfileData): Promise<Either<DomainError, User>> {
    try {
      const dto = await this.dataSource.updateProfile(userId, data);
      return { right: UserMapper.toDomain(dto) };
    } catch (error) {
      return { left: mapSupabaseErrorToDomainError(error) };
    }
  }
}
