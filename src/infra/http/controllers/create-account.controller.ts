import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { RegisterDeliveryPersonUseCase } from '@/domain/account/application/use-cases/register-delivery-person.use-case'
import { DeliveryPersonAlreadyExistsError } from '@/domain/account/application/use-cases/errors/delivery-person-already-exists.error'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'

const bodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(
    private readonly registerDeliveryPerson: RegisterDeliveryPersonUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const { name, cpf, password } = body

    const result = await this.registerDeliveryPerson.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryPersonAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
