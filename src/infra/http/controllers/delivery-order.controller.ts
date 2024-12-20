import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { CurrentUser } from '@/infra/auth/decorator/current-user.decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeliveryOrderUseCase } from '@/domain/delivery/application/use-cases/delivery-order.use-case'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { NotAllowedError } from '@/domain/account/application/use-cases/errors/not-allowed.error'

const bodySchema = z.object({
  confirmationPhotoId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/orders/:id/delivery')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrder: DeliveryOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: BodySchema,
    @Param('id') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const { confirmationPhotoId } = body

    const result = await this.deliveryOrder.execute({
      orderId,
      deliveryPersonId: user.sub,
      confirmationPhotoId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
