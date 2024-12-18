import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdminsRepository } from '@/domain/account/application/repositories/admins.repository.interface'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins.repository'
import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { PrismaDeliveryPeopleRepository } from './prisma/repositories/prisma-delivery-people.repository'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients.repository.interface'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients.repository'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders.repository.interface'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders.repository'
import { OrderConfirmationPhotosRepository } from '@/domain/delivery/application/repositories/order-confirmation-photos.repository.interface'
import { PrismaOrderConfirmationPhotosRepository } from './prisma/repositories/prisma-order-confirmation-photos.repository'
import { AddressesRepository } from '@/domain/delivery/application/repositories/addresses.repository.interface'
import { PrismaAddressesRepository } from './prisma/repositories/prisma-addresses.repository'

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
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: OrderConfirmationPhotosRepository,
      useClass: PrismaOrderConfirmationPhotosRepository,
    },
    {
      provide: AddressesRepository,
      useClass: PrismaAddressesRepository,
    },
  ],
  exports: [
    PrismaService,
    AdminsRepository,
    DeliveryPeopleRepository,
    RecipientsRepository,
    OrdersRepository,
    OrderConfirmationPhotosRepository,
    AddressesRepository,
  ],
})
export class DatabaseModule {}
