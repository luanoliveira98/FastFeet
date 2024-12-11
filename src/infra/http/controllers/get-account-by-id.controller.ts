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
import { GetDeliveryPersonByIdUseCase } from '@/domain/account/application/use-cases/get-delivery-person-by-id.use-case'

@Controller('/accounts/:id')
export class GetAccountByIdController {
  constructor(
    private readonly getDeliveryPersonById: GetDeliveryPersonByIdUseCase,
  ) {}

  @Get()
  @UseGuards(AdminAuthGuard)
  async handle(@Param('id') deliveryPersonId: string) {
    const result = await this.getDeliveryPersonById.execute({
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
