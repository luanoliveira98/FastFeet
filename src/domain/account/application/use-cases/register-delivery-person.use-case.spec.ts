import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { HasherFake } from 'test/cryptography/hasher.fake'
import { RegisterDeliveryPersonUseCase } from './register-delivery-person.use-case'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { DeliveryPersonAlreadyExistsError } from './errors/delivery-person-already-exists.error'

describe('Register Delivery Person', () => {
  let sut: RegisterDeliveryPersonUseCase
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository
  let hasherFake: HasherFake

  beforeEach(() => {
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()
    hasherFake = new HasherFake()

    sut = new RegisterDeliveryPersonUseCase(
      inMemoryDeliveryPeopleRepository,
      hasherFake,
    )
  })

  it('should be able to register a delivery person', async () => {
    const result = await sut.execute({
      name: 'john doe',
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPerson: inMemoryDeliveryPeopleRepository.items[0],
    })
  })

  it('should be able to hash delivery person password upon registration', async () => {
    const result = await sut.execute({
      name: 'john doe',
      cpf: '12345678910',
      password: '123456',
    })

    const hashedPassword = await hasherFake.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPeopleRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('should not be able to register a delivery person when cpf already exists', async () => {
    const deliveryPerson = await makeDeliveryPersonFactory({
      cpf: '12345678910',
    })

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      name: 'john doe',
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryPersonAlreadyExistsError)
  })
})
