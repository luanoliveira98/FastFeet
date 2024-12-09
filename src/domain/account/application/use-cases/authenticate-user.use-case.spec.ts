import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins.repository'
import { AuthenticateUserUseCase } from './authenticate-user.use-case'
import { InMemoryDeliveryPeopleRepository } from 'test/repositories/in-memory-delivery-people.repository'
import { HasherFake } from 'test/cryptography/hasher.fake'
import { EncrypterFake } from 'test/cryptography/encrypter.fake'
import { makeAdminFactory } from 'test/factories/make-admin.factory'
import { makeDeliveryPersonFactory } from 'test/factories/make-delivery-person.factory'
import { WrongCredentialsError } from './errors/wrong-credentials.error'

describe('Authenticate User', () => {
  let sut: AuthenticateUserUseCase
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let inMemoryDeliveryPeopleRepository: InMemoryDeliveryPeopleRepository
  let hasherFake: HasherFake
  let encrypterFake: EncrypterFake

  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    inMemoryDeliveryPeopleRepository = new InMemoryDeliveryPeopleRepository()
    hasherFake = new HasherFake()
    encrypterFake = new EncrypterFake()

    sut = new AuthenticateUserUseCase(
      inMemoryAdminsRepository,
      inMemoryDeliveryPeopleRepository,
      hasherFake,
      encrypterFake,
    )
  })

  it('should be able to authenticate an user as admin', async () => {
    const cpf = '12345678910'
    const password = '123456'

    const admin = makeAdminFactory({
      cpf,
      password: await hasherFake.hash(password),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf,
      password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should be able to authenticate an user as delivery person', async () => {
    const cpf = '12345678910'
    const password = '123456'

    const admin = makeDeliveryPersonFactory({
      cpf,
      password: await hasherFake.hash(password),
    })

    inMemoryDeliveryPeopleRepository.items.push(admin)

    const result = await sut.execute({
      cpf,
      password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an user when user is not found', async () => {
    const result = await sut.execute({
      cpf: '12345678910',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate an user when password is wrong', async () => {
    const cpf = '12345678910'

    const admin = makeAdminFactory({
      cpf,
      password: await hasherFake.hash('123456'),
    })

    inMemoryAdminsRepository.items.push(admin)

    const result = await sut.execute({
      cpf,
      password: '123455',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
