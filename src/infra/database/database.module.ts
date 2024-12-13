import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminsRepository } from '@/domain/account/application/repositories/admins.repository.interface'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins.repository'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { PrismaDeliveryPeopleRepository } from './prisma/repositories/prisma-delivery-people.repository'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipient.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: DeliveryPeopleRepository,
      useClass: PrismaDeliveryPeopleRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliveryPeopleRepository,
    RecipientsRepository,
  ],
})
export class DatabaseModule {}
