import { Either, left, right } from '@/core/helpers/either.helper'
import { Notification } from '../enterprise/entities/notification.entity'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../repositories/notifications.repository.interface'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { NotAllowedError } from '@/domain/account/application/use-cases/errors/not-allowed.error'

export interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

export type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(
    private readonly notificationsRepostiroy: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepostiroy.findById(notificationId)

    if (!notification) return left(new ResourceNotFoundError())

    if (notification.recipientId.toString() !== recipientId)
      return left(new NotAllowedError())

    notification.read()

    await this.notificationsRepostiroy.save(notification)

    return right({ notification })
  }
}
