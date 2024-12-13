import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { EditOrderUseCase } from '@/domain/delivery/application/use-cases/edit-order.use-case'
import { OrderStatus } from '@prisma/client'

const orderStatusSchema = z.nativeEnum(OrderStatus)

const bodySchema = z.object({
  recipientId: z.string().uuid(),
  deliveryPersonId: z.string().uuid().optional(),
  status: orderStatusSchema,
  storedAt: z.coerce.date(),
  postedAt: z.coerce.date().optional(),
  pickedUpAt: z.coerce.date().optional(),
  deliveredAt: z.coerce.date().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/orders/:id')
export class EditOrderController {
  constructor(private readonly editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: BodySchema,
    @Param('id') orderId: string,
  ) {
    const {
      recipientId,
      deliveryPersonId,
      status,
      storedAt,
      postedAt,
      pickedUpAt,
      deliveredAt,
    } = body

    const result = await this.editOrder.execute({
      orderId,
      recipientId,
      deliveryPersonId,
      status,
      storedAt,
      postedAt,
      pickedUpAt,
      deliveredAt,
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
