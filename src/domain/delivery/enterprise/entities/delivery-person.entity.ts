import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

export interface DeliveryPersonProps {
  name: string
  cpf: string
  password: string
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  static create(props: DeliveryPersonProps, id?: UniqueEntityID) {
    return new DeliveryPerson(props, id)
  }
}
