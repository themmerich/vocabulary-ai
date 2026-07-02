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

/**
 * Registration payload. Selecting the role here is a development convenience —
 * it lets anyone self-register as an admin and should be removed before a real
 * deployment.
 */
export type RegisterCredentials = Credentials & {
  role: Role;
};
