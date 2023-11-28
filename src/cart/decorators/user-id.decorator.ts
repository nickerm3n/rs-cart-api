import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserIdQuery = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.query.userId;
  },
);
