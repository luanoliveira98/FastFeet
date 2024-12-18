import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { GetRecipientByIdUseCase } from '@/domain/delivery/application/use-cases/get-recipient-by-id.use-case'
import { RecipientWithAddressPresenter } from '../presenters/recipient-with-address.presenter'

@Controller('/recipients/:id')
export class GetRecipientByIdController {
  constructor(private readonly getRecipientById: GetRecipientByIdUseCase) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') recipientId: string) {
    const result = await this.getRecipientById.execute({
      id: recipientId,
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

    return {
      recipient: RecipientWithAddressPresenter.toHttp(result.value.recipient),
    }
  }
}
