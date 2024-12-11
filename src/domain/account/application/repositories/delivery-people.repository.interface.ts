import { DeliveryPerson } from '../../enterprise/entities/delivery-person.entity'

export abstract class DeliveryPeopleRepository {
  abstract findById(id: string): Promise<DeliveryPerson | null>
  abstract findByCpf(cpf: string): Promise<DeliveryPerson | null>
  abstract create(deliveryPerson: DeliveryPerson): Promise<void>
  abstract save(deliveryPerson: DeliveryPerson): Promise<void>
  abstract delete(deliveryPerson: DeliveryPerson): Promise<void>
}
