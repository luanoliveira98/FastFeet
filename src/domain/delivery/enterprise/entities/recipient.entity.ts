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
    return this.name
  }

  set name(name: string) {
    this.name = name
  }

  get street() {
    return this.street
  }

  set street(street: string) {
    this.street = street
  }

  get number() {
    return this.number
  }

  set number(number: number) {
    this.number = number
  }

  get complement() {
    return this.complement
  }

  set complement(complement: string) {
    this.complement = complement
  }

  get neighborhood() {
    return this.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.neighborhood = neighborhood
  }

  get city() {
    return this.city
  }

  set city(city: string) {
    this.city = city
  }

  get state() {
    return this.state
  }

  set state(state: string) {
    this.state = state
  }

  get zipcode() {
    return this.zipcode
  }

  set zipcode(zipcode: string) {
    this.zipcode = zipcode
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    return new Recipient(props, id)
  }
}
