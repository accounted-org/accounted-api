import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { SECURITY_EVENT_REPOSITORY, SECURITY_EVENT_SERVICE } from './tokens';
import { PrismaSecurityEventPersistenceAdapter } from './repository';
import { SecurityEventService } from './service/security-event.service';

@Global()
@Module({
  providers: [
    {
      provide: SECURITY_EVENT_REPOSITORY,
      useFactory: (prisma: PrismaService) => {
        return new PrismaSecurityEventPersistenceAdapter(prisma);
      },
      inject: [PrismaService],
    },
    {
      provide: SECURITY_EVENT_SERVICE,
      useClass: SecurityEventService,
    },
  ],
  exports: [
    {
      provide: SECURITY_EVENT_SERVICE,
      useClass: SecurityEventService,
    },
  ],
})
export class SecurityEventModule {}
