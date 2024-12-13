import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidOrderError extends Error implements UseCaseError {
  constructor() {
    super('Invalid order')
  }
}
