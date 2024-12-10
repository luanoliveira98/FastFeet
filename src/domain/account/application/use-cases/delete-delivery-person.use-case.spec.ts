import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'
import { DeleteDeliveryPersonUseCase } from './delete-delivery-person.use-case'

describe('Delete Delivery Person', () => {
  let sut: DeleteDeliveryPersonUseCase
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository

  beforeEach(() => {
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()

    sut = new DeleteDeliveryPersonUseCase(inMemoryDeliveryPeopleRepository)
  })

  it('should be able to delete a delivery person', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      id: deliveryPerson.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPeopleRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery person when id does not exists', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
