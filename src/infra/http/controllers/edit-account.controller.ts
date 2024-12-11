import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { DeliveryPersonAlreadyExistsError } from '@/domain/account/application/use-cases/errors/delivery-person-already-exists.error'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { EditDeliveryPersonUseCase } from '@/domain/account/application/use-cases/edit-delivery-person.use-case'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

const bodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/accounts/:id')
export class EditAccountController {
  constructor(private readonly editDeliveryPerson: EditDeliveryPersonUseCase) {}

  @Put()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: BodySchema,
    @Param('id') deliveryPersonId: string,
  ) {
    const { name, cpf } = body

    const result = await this.editDeliveryPerson.execute({
      name,
      cpf,
      deliveryPersonId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryPersonAlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
