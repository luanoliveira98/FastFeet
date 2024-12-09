import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'

export abstract class DeliveryPeopleRepository {
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | null>
}
