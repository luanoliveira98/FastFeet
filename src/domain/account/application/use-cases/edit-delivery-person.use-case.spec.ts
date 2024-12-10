import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists.error'
import { EditDeliveryPersonUseCase } from './edit-delivery-person.use-case'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

describe('Edit Delivery Person', () => {
  let sut: EditDeliveryPersonUseCase
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository

  beforeEach(() => {
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()

    sut = new EditDeliveryPersonUseCase(inMemoryDeliveryPeopleRepository)
  })

  it('should be able to edit a delivery person', async () => {
    const deliveryPerson = makeDeliveryPersonFactory({
      cpf: '12345678910',
    })

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'john doe',
      cpf: '12345678910',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPerson: expect.objectContaining({
        name: 'john doe',
      }),
    })
  })

  it('should not be able to edit a delivery person when id does not exists', async () => {
    const result = await sut.execute({
      deliveryPersonId: 'wrong-id',
      name: 'john doe',
      cpf: '12345678910',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a delivery person when cpf already exists', async () => {
    const deliveryPerson = makeDeliveryPersonFactory({
      cpf: '12345678910',
    })

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    inMemoryDeliveryPeopleRepository.create(
      makeDeliveryPersonFactory({
        cpf: '12345678911',
      }),
    )

    const result = await sut.execute({
      deliveryPersonId: deliveryPerson.id.toString(),
      name: 'john doe',
      cpf: '12345678911',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryPersonAlreadyExistsError)
  })
})
