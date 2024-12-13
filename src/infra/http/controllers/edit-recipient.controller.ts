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
import { EditRecipientUseCase } from '@/domain/delivery/application/use-cases/edit-recipient.use-case'

const bodySchema = z.object({
  name: z.string(),
  street: z.string(),
  number: z.number().min(1),
  complement: z.string().optional(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipcode: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/recipients/:id')
export class EditRecipientController {
  constructor(private readonly editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: BodySchema,
    @Param('id') recipientId: string,
  ) {
    const {
      name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
    } = body

    const result = await this.editRecipient.execute({
      recipientId,
      name,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode,
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
