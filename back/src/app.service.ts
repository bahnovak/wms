import { Injectable } from '@nestjs/common';
import { ActiveUserData } from './iam/interfaces/active-user-data.interface';

@Injectable()
export class AppService {
  identify(user: ActiveUserData): ActiveUserData {
    return user;
  }
}
