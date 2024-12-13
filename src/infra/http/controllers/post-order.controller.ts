import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { PostOrderUseCase } from '@/domain/delivery/application/use-cases/post-order.use-case'

@Controller('/orders/:id/post')
export class PostOrderController {
  constructor(private readonly postOrder: PostOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') orderId: string) {
    const result = await this.postOrder.execute({
      orderId,
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
