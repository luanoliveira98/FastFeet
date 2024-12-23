import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderPostedSubscriber } from '@/domain/notification/subscribers/on-order-posted.subscriber'
import { SendNotificationUseCase } from '@/domain/notification/use-cases/send-notification.use-case'
import { OnOrderPickedUpSubscriber } from '@/domain/notification/subscribers/on-order-picked-up.subscriber'
import { OnOrderDeliveredSubscriber } from '@/domain/notification/subscribers/on-order-delivered.subscriber'

@Module({
  imports: [DatabaseModule],
  providers: [
    SendNotificationUseCase,
    OnOrderPostedSubscriber,
    OnOrderDeliveredSubscriber,
    OnOrderPickedUpSubscriber,
  ],
})
export class EventsModule {}
