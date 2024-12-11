import { Either, left, right } from '@/core/helpers/either.helper'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients.repository.interface'
import { Recipient } from '../../enterprise/entities/recipient.entity'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

interface GetRecipientByIdUseCaseRequest {
  id: string
}

type GetRecipientByIdUseCaseReponse = Either<
  ResourceNotFoundError,
  { recipient: Recipient }
>

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(private readonly recipientsRepository: RecipientsRepository) {}

  async execute({
    id,
  }: GetRecipientByIdUseCaseRequest): Promise<GetRecipientByIdUseCaseReponse> {
    const recipient = await this.recipientsRepository.findById(id)

    if (!recipient) return left(new ResourceNotFoundError())

    return right({ recipient })
  }
}
