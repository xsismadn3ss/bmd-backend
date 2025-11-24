import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// this decorator marks routes as public, skipping the auth guard
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
