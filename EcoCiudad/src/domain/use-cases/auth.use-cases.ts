import { type User } from '../entities';
import { type DomainError } from '../errors';
import { type Either, type CitizenSignUpData } from '../repositories';
import { type AuthRepository } from '../repositories';

export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<Either<DomainError, User>> {
    return this.authRepository.signIn(email, password);
  }
}

export class SignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string, password: string, displayName: string): Promise<Either<DomainError, User>> {
    return this.authRepository.signUp(email, password, displayName);
  }
}

export class CitizenSignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(data: CitizenSignUpData): Promise<Either<DomainError, User>> {
    return this.authRepository.signUpCitizen(data);
  }
}

export class SignOutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<Either<DomainError, void>> {
    return this.authRepository.signOut();
  }
}

export class GetCurrentUserUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(): Promise<Either<DomainError, User | null>> {
    return this.authRepository.getCurrentUser();
  }
}

export class ResetPasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string): Promise<Either<DomainError, void>> {
    return this.authRepository.resetPassword(email);
  }
}

export class UpdatePasswordUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(newPassword: string): Promise<Either<DomainError, void>> {
    return this.authRepository.updatePassword(newPassword);
  }
}

export class ResendVerificationUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(email: string): Promise<Either<DomainError, void>> {
    return this.authRepository.resendVerificationEmail(email);
  }
}
