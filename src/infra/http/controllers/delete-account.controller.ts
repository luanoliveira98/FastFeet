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
import { DeleteDeliveryPersonUseCase } from '@/domain/account/application/use-cases/delete-delivery-person.use-case'

@Controller('/accounts/:id')
export class DeleteAccountController {
  constructor(
    private readonly deleteDeliveryPerson: DeleteDeliveryPersonUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') deliveryPersonId: string) {
    const result = await this.deleteDeliveryPerson.execute({
      id: deliveryPersonId,
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
