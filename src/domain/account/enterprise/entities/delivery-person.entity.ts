import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { UserRole } from '@prisma/client'

export interface DeliveryPersonProps {
  name: string
  cpf: string
  password: string
  role?: UserRole
}

export class DeliveryPerson extends Entity<DeliveryPersonProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get cpf() {
    return this.props.cpf
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get role() {
    return this.props.role
  }

  static create(props: DeliveryPersonProps, id?: UniqueEntityID) {
    return new DeliveryPerson({ ...props, role: 'DELIVERY_PERSON' }, id)
  }
}
