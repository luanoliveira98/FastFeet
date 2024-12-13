import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteOrderUseCase } from '@/domain/delivery/application/use-cases/delete-order.use-case'

@Controller('/orders/:id')
export class DeleteOrderController {
  constructor(private readonly deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') orderId: string) {
    const result = await this.deleteOrder.execute({
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
  }
}
