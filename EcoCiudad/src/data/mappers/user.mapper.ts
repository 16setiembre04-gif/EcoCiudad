import { type User } from '../../domain/entities';
import { type UserDTO } from '../dto';

export class UserMapper {
  static toDomain(dto: UserDTO): User {
    return {
      id: dto.id,
      email: dto.email,
      displayName: dto.display_name,
      firstName: dto.first_name,
      lastName: dto.last_name,
      phone: dto.phone,
      department: dto.department,
      district: dto.district,
      avatarUrl: dto.avatar_url,
      role: dto.role as User['role'],
      isEmailVerified: dto.is_email_verified,
      createdAt: new Date(dto.created_at),
      updatedAt: new Date(dto.updated_at),
    };
  }

  static toDto(entity: User): UserDTO {
    return {
      id: entity.id,
      email: entity.email,
      display_name: entity.displayName,
      first_name: entity.firstName,
      last_name: entity.lastName,
      phone: entity.phone,
      department: entity.department,
      district: entity.district,
      avatar_url: entity.avatarUrl,
      role: entity.role,
      is_email_verified: entity.isEmailVerified,
      created_at: entity.createdAt.toISOString(),
      updated_at: entity.updatedAt.toISOString(),
    };
  }
}
