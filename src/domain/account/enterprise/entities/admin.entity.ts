import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { UserRole } from '@prisma/client'

export interface AdminProps {
  name: string
  cpf: string
  password: string
  role?: UserRole
}

export class Admin extends Entity<AdminProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  static create(props: AdminProps, id?: UniqueEntityID) {
    return new Admin({ ...props, role: 'ADMIN' }, id)
  }
}
