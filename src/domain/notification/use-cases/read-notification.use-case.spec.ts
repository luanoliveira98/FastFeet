import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { ReadNotificationUseCase } from './read-notification.use-case'
import { makeNotificationFactory } from 'test/factories/make-notification.factory'

describe('Read Notification', () => {
  let sut: ReadNotificationUseCase
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotificationFactory()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotificationFactory()

    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'wrong-recipient-id',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toBeUndefined()
  })
})
