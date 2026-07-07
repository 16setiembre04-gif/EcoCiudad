import { BaseEntity } from './base.entity';

export interface User extends BaseEntity {
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  district?: string;
  avatarUrl?: string;
  role: UserRole;
  isEmailVerified: boolean;
  ecoPoints?: number;
  level?: number;
}

export type UserRole = 'citizen' | 'operator' | 'admin';
