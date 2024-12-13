import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { PickUpOrderUseCase } from '@/domain/delivery/application/use-cases/pick-up-order.use-case'
import { CurrentUser } from '@/infra/auth/decorator/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/orders/:id/pick-up')
export class PickUpOrderController {
  constructor(private readonly pickUpOrder: PickUpOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string, @CurrentUser() user: UserPayload) {
    const result = await this.pickUpOrder.execute({
      orderId,
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
  }
}
