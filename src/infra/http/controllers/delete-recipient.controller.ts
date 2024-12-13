import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminAuthGuard } from '@/infra/auth/guard/admin-auth.guard'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/use-cases/delete-recipient.use-case'

@Controller('/recipients/:id')
export class DeleteRecipientController {
  constructor(private readonly deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipient.execute({
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
  }
}
