import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class DeliveryPersonAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Delivery Person "${identifier}" already exists.`)
  }
}
