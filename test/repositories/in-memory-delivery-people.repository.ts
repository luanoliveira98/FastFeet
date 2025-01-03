import { DeliveryPeopleRepository } from '@/domain/account/application/repositories/delivery-people.repository.interface'
import { DeliveryPerson } from '@/domain/account/enterprise/entities/delivery-person.entity'

export class InMemoryDeliveryPeopleRepository
  implements DeliveryPeopleRepository
{
  public items: DeliveryPerson[] = []

  async findById(id: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = this.items.find((item) => item.id.toString() === id)

    if (!deliveryPerson) return null

    return deliveryPerson
  }

  async findByCpf(cpf: string): Promise<DeliveryPerson | null> {
    const deliveryPerson = this.items.find((item) => item.cpf === cpf)

    if (!deliveryPerson) return null

    return deliveryPerson
  }

  async create(deliveryPerson: DeliveryPerson): Promise<void> {
    this.items.push(deliveryPerson)
  }

  async save(deliveryPerson: DeliveryPerson): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items[itemIndex] = deliveryPerson
  }

  async delete(deliveryPerson: DeliveryPerson): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryPerson.id,
    )

    this.items.splice(itemIndex, 1)
  }
}
