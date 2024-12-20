import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { HasherFake } from 'test/cryptography/hasher.fake'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { ChangeUserPasswordUseCase } from './change-user-password.use-case'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins.repository'
import { makeAdminFactory } from 'test/factories/make-admin.factory'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found.error'

describe('Change User Password', () => {
  let sut: ChangeUserPasswordUseCase
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository
  let hasherFake: HasherFake

  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()
    hasherFake = new HasherFake()

    sut = new ChangeUserPasswordUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPeopleRepository,
      hasherFake,
    )
  })

  it('should be able to change an user [ADMIN] password', async () => {
    const admin = makeAdminFactory()

    await inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      userId: admin.id.toString(),
      password: 'new-password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdminsRepository.items[0].password).toBe(
      'new-password-hashed',
    )
  })

  it('should be able to change an user [DELIVERY_PERSON] password', async () => {
    const deliveryPerson = makeDeliveryPersonFactory()

    inMemoryDeliveryPeopleRepository.create(deliveryPerson)

    const result = await sut.execute({
      userId: deliveryPerson.id.toString(),
      password: 'new-password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveryPeopleRepository.items[0].password).toBe(
      'new-password-hashed',
    )
  })

  it('should not be able to change an user password when id does not exists', async () => {
    const result = await sut.execute({
      userId: 'wrong-id',
      password: 'new-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
