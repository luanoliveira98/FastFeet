import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidOrderConfirmationPhotoError extends Error implements UseCaseError {
  constructor() {
    super('Invalid order confirmation photo')
  }
}
