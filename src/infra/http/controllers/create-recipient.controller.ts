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
import { RegisterRecipientUseCase } from '@/domain/delivery/application/use-cases/register-recipient.use-case'

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

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private readonly registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AdminAuthGuard)
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
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

    const result = await this.registerRecipient.execute({
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
      throw new BadRequestException()
    }
  }
}
