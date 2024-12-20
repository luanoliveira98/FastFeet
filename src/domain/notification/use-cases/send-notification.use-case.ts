import { Either, right } from '@/core/helpers/either.helper'
import { Notification } from '../enterprise/entities/notification.entity'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../repositories/notifications.repository.interface'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type SendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
>

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepostiroy: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    })

    await this.notificationsRepostiroy.create(notification)

    return right({ notification })
  }
}
