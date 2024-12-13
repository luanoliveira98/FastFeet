import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidDeliveryPersonError extends Error implements UseCaseError {
  constructor() {
    super('Invalid delivery person')
  }
}
