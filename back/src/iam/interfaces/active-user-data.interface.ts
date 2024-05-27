import { Role } from 'src/users/enums/role.enum';

export interface ActiveUserData {
  id: number;
  sub: number;
  email: string;
  role: Role;
}
