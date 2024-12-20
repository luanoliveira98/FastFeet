import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation.pipe'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ChangeUserPasswordUseCase } from '@/domain/account/application/use-cases/change-user-password.use-case'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

const bodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/user/:id/password')
export class ChangeUserPasswordController {
  constructor(private readonly changeUserPassword: ChangeUserPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(
    @Body(bodyValidationPipe) body: BodySchema,
    @Param('id') userId: string,
  ) {
    const { password } = body

    const result = await this.changeUserPassword.execute({
      userId,
      password,
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
