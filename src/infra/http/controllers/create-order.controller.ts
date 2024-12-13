import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { RegisterOrderUseCase } from '@/domain/delivery/application/use-cases/register-order.use-case'

const bodySchema = z.object({
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private readonly registerOrder: RegisterOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const { recipientId } = body

    const result = await this.registerOrder.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
