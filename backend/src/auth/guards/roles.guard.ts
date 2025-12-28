import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1️⃣ Obtener roles requeridos desde el decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles definidos → acceso libre
    if (!requiredRoles) {
      return true;
    }

    // 2️⃣ Obtener usuario desde req (inyectado por JWT)
    const { user } = context.switchToHttp().getRequest();

    // 3️⃣ Comparar rol del usuario con roles permitidos
    return requiredRoles.includes(user.role);
  }
}
