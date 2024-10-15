import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: '085B5CF3FB261C9CF855E99D64ED02CE299412977C3D713C850FD98C89CB4FF2',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
