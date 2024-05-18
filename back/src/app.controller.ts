import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ActiveUser } from './iam/decorators/active-user.decorator';
import { ActiveUserData } from './iam/interfaces/active-user-data.interface';
import { AuthType } from './iam/authentication/enums/auth-type.enum';
import { Auth } from './iam/authentication/decorators/auth.decorator';

@Auth(AuthType.Bearer)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  identify(@ActiveUser() user: ActiveUserData): ActiveUserData {
    return this.appService.identify(user);
  }
}
