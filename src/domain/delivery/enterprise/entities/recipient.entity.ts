import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id.value-object'

export interface RecipientProps {
  name: string
  street: string
  number: number
  complement?: string | null
  neighborhood: string
  city: string
  state: string
  zipcode: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
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

  static create(props: RecipientProps, id?: UniqueEntityID) {
    return new Recipient(props, id)
  }
}
