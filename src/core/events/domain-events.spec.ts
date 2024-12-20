import { AggregateRoot } from '../entities/aggregate-root.entity'
import { UniqueEntityID } from '../entities/value-objects/unique-entity-id.value-object'
import { DomainEvent } from './domain-event.interface'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this.aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // Registered subscriber (i'm listening for the "answer created" event)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // I'm creating an answer, but WITHOUT saving it to the DB
    const aggregate = CustomAggregate.create()

    // I'm ensuring that the event was created, but NOT dispatched
    expect(aggregate.domainEvents).toHaveLength(1)

    // I'm saving the "answer" in the DB and then dispatching the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscriber listens to the event and does what needs to be done with the data
    expect(callbackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
