# FastFeet

This is a challenge from Rocketseat's NodeJs course. Development of an API to control orders from a fictitious carrier.

## Application Rules

- [x] The application must have two types of user, delivery person and/or admin
- [x] It must be possible to log in with CPF and password
- [x] It must be possible to perform CRUD of delivery people
- [ ] It must be possible to perform CRUD of orders
- [ ] It must be possible to perform CRUD of customers
- [ ] It must be possible to mark an order as waiting (avaiable to pickup)
- [ ] It must be possible to pick up an order
- [ ] It must be possible to mark an order as delivered
- [ ] It must be possible to list orders with delivery addresses close to the delivery person's location
- [ ] It must be possible to change a user's password
- [ ] It must be possible to list a user's deliveries
- [ ] It must be possible to notify the recipient of each change in the order status

## Business Rules

- [x] Only admin users can perform CRUD operations on delivery people
- [ ] Only admin users can perform CRUD operations on orders
- [ ] Only admin users can perform CRUD operations on customers
- [ ] To mark an order as delivered, it is mandatory to send a photo
- [ ] Only the delivery person who picked up the order can mark it as delivered
- [ ] Only the admin can chan a user's password
- [ ] It should not be possible a delivery person to list the orders of another delivery person

## Concepts to practice

- DDD, Domain Events, Clean Architecture
- Authentication and Authorization (RBAC)
- Unit tests and e2e
- Integration with external services

## Aplication context

https://www.figma.com/design/hn0qGhnSHDVst7oaY3PF72/FastFeet?node-id=0-1&node-type=canvas