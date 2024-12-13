import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetOrderByIdUseCase } from '@/domain/delivery/application/use-cases/get-order-by-id.use-case'
import { OrderPresenter } from '../presenters/order.presenter'

@Controller('/orders/:id')
export class GetOrderByIdController {
  constructor(private readonly getOrderById: GetOrderByIdUseCase) {}

  @Get()
  async handle(@Param('id') orderId: string) {
    const result = await this.getOrderById.execute({
      id: orderId,
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

    return {
      order: OrderPresenter.toHttp(result.value.order),
    }
  }
}
