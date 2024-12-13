import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidDatesError extends Error implements UseCaseError {
  constructor() {
    super('Invalid dates')
  }
}
