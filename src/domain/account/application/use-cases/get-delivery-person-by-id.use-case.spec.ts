import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { GetDeliveryPersonByIdUseCase } from './get-delivery-person-by-id.use-case'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

describe('Get Delivery Person By Id', () => {
  let sut: GetDeliveryPersonByIdUseCase
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository

  beforeEach(() => {
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()

    sut = new GetDeliveryPersonByIdUseCase(inMemoryDeliveryPeopleRepository)
  })

  it('should be able to get a delivery person', async () => {
    const deliveryPerson = await makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      id: deliveryPerson.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPerson,
    })
  })

  it('should not be able to get a delivery person when id does not exists', async () => {
    const deliveryPerson = await makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      id: 'wrong-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
