import { UseCaseError } from '@/core/errors/use-case-error.interface'

export class InvalidOrderConfirmationPhotoTypeError
  extends Error
  implements UseCaseError
{
  constructor(type: string) {
    super(`File type "${type}" is not valid.`)
  }
}
