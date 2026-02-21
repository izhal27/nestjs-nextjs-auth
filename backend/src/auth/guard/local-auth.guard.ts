import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthorized = (await super.canActivate(context)) as boolean;

    if (isAuthorized) {
      await super.logIn(request);
    }

    return isAuthorized;
  }
}
