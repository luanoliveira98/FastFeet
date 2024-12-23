# FastFeet

This is a challenge from Rocketseat's NodeJs course. Development of an API to control orders from a fictitious carrier.

## Application Rules

- [x] The application must have two types of user, delivery person and/or admin
- [x] It must be possible to log in with CPF and password
- [x] It must be possible to perform CRUD of delivery people
- [x] It must be possible to perform CRUD of orders
- [x] It must be possible to perform CRUD of customers
- [x] It must be possible to mark an order as waiting (avaiable to pickup)
- [x] It must be possible to pick up an order
- [x] It must be possible to mark an order as delivered
- [x] It must be possible to list orders with delivery addresses close to the delivery person's location
- [x] It must be possible to list a user's deliveries
- [x] It must be possible to change a user's password
- [x] It must be possible to notify the recipient of each change in the order status

## Business Rules

- [x] Only admin users can perform CRUD operations on delivery people
- [x] Only admin users can perform CRUD operations on orders
- [x] Only admin users can perform CRUD operations on customers
- [x] To mark an order as delivered, it is mandatory to send a photo
- [x] Only the delivery person who picked up the order can mark it as delivered
- [x] It should not be possible a delivery person to list the orders of another delivery person 
- [x] Only the admin can change a user's password

## Concepts to practice

- DDD, Domain Events, Clean Architecture
- Authentication and Authorization (RBAC)
- Unit tests and e2e
- Integration with external services

## Aplication context

https://www.figma.com/design/hn0qGhnSHDVst7oaY3PF72/FastFeet?node-id=0-1&node-type=canvas