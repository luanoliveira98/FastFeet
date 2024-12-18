import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

export interface AddressProps {
  recipientId?: UniqueEntityID | null
  deliveryPersonId?: UniqueEntityID | null
  street: string
  number: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

export class Address extends Entity<AddressProps> {
  get recipientId() {
    return this.props.recipientId
  }

  set recipientId(recipientId: UniqueEntityID) {
    this.props.recipientId = recipientId
  }

  get deliveryPersonId() {
    return this.props.deliveryPersonId
  }

  set deliveryPersonId(deliveryPersonId: UniqueEntityID) {
    this.props.deliveryPersonId = deliveryPersonId
  }

  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.props.street = street
  }

  get number() {
    return this.props.number
  }

  set number(number: number) {
    this.props.number = number
  }

  get complement() {
    return this.props.complement
  }

  set complement(complement: string) {
    this.props.complement = complement
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
  }

  get zipcode() {
    return this.props.zipcode
  }

  set zipcode(zipcode: string) {
    this.props.zipcode = zipcode
  }

  static create(props: AddressProps, id?: UniqueEntityID) {
    return new Address(props, id)
  }
}
