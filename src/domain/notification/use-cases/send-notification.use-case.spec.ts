import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { SendNotificationUseCase } from './send-notification.use-case'

describe('Send Notification', () => {
  let sut: SendNotificationUseCase
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'New notification',
      content: 'Notification content',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      result.value?.notification,
    )
  })
})
