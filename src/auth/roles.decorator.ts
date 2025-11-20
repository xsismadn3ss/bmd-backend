import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// create the decorator roles to protect routes from unauthorized users
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
