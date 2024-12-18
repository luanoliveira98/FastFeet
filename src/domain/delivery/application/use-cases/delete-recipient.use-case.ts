import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface DeleteRecipientUseCaseRequest {
  id: string
}

type DeleteRecipientUseCaseReponse = Either<ResourceNotFoundError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private readonly recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseReponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) return left(new ResourceNotFoundError())

    await this.recipientsRepository.delete(id)

    return right(null)
  }
}
