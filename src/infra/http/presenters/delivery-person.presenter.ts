import { DeliveryPerson } from '@/domain/account/enterprise/entities/delivery-person.entity'

export class DeliveryPersonPresenter {
  static toHttp(deliveryPerson: DeliveryPerson) {
    return {
      deliveryPersonId: deliveryPerson.id.toString(),
      name: deliveryPerson.name,
      cpf: deliveryPerson.cpf,
    }
  }
}
