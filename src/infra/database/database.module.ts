import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminsRepository } from '@/domain/account/application/repositories/admins.repository.interface'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins.repository'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { PrismaDevelieryPeopleRepository } from './prisma/repositories/prisma-delivery-people.repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: DeliveryPeopleRepository,
      useClass: PrismaDevelieryPeopleRepository,
    },
  ],
  exports: [PrismaService, AdminsRepository, DeliveryPeopleRepository],
})
export class DatabaseModule {}
