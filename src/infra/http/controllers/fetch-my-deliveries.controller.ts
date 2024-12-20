import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CurrentUser } from '@/infra/auth/decorator/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FetchDeliveryPersonDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-delivery-person-deliveries.use-case'
import { OrderPresenter } from '../presenters/order.presenter'

@Controller('/my-deliveries')
export class FetchMyDeliveriesController {
  constructor(
    private readonly fetchDeliveryPersonDeliveries: FetchDeliveryPersonDeliveriesUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.fetchDeliveryPersonDeliveries.execute({
      deliveryPersonId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(OrderPresenter.toHttp),
    }
  }
}
