import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidRecipientError extends Error implements UseCaseError {
  constructor() {
    super('Invalid recipient')
  }
}
