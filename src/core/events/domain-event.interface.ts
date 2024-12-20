import { UniqueEntityID } from '../entities/value-objects/unique-entity-id.value-object'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
