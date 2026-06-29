export type Role = 'USER' | 'ADMIN';

export type AuthUser = {
  readonly id: string;
  readonly email: string;
  readonly role: Role;
};

export type Credentials = {
  email: string;
  password: string;
};
