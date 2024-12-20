import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'
import { ValueObject } from '@/core/entities/value-objects/value-object'

export interface RecipientWithAddressProps {
  recipientId: UniqueEntityID
  name: string
  addressId: UniqueEntityID
  street: string
  number: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipcode: string
  latitude: number
  longitude: number
}

export class RecipientWithAddress extends ValueObject<RecipientWithAddressProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get name() {
    return this.props.name
  }

  get addressId() {
    return this.props.addressId
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get complement() {
    return this.props.complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get zipcode() {
    return this.props.zipcode
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  static create(props: RecipientWithAddressProps) {
    return new RecipientWithAddress(props)
  }
}
