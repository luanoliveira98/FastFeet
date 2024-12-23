import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders.repository'
import { SendNotificationUseCase } from '../use-cases/send-notification.use-case'
import { MockInstance } from 'vitest'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses.repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { makeOrderFactory } from 'test/factories/make-order.factory'
import { waitFor } from 'test/utils/wait-for.util'
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { OnOrderPickedUpSubscriber } from './on-order-picked-up.subscriber'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'

describe('On Order Picked Up Subscriber', () => {
  let inMemoryAddressesRepository: InMemoryAddressesRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sendNotificationUseCase: SendNotificationUseCase
  let sendNotificationExecuteSpy: MockInstance

  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryAddressesRepository,
    )
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnOrderPickedUpSubscriber(
      inMemoryOrdersRepository,
      sendNotificationUseCase,
      inMemoryDeliveryPeopleRepository,
    )
  })

  it('should be able to send a notification when an order is picked up', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()
    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const order = makeOrderFactory({
      deliveryPersonId: deliveryPerson.id,
    })
    inMemoryOrdersRepository.create(order)

    order.pickUp()
    inMemoryOrdersRepository.save(order)

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled())

    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        recipientId: order.recipientId,
        title: `Order ${order.id.toString()} picked up`,
      }),
    )
  })
})
