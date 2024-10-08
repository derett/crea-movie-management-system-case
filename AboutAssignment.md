## Current Status

[Back to README](README.md)

### Database expectations are met:

- User consists of username, password and age
- Two roles: Manager and Customer
- Movies: name and ageRestriction
- Sessions: date, static Time Slots (FK), Room Numbers (FK) and Movie (FK)
- Association between Movies and Sessions as `Movies hasMany Sessions`
- Tickets: Customer (User FK) and Session (FK)
- Watch History: Customer (User FK), Movie (FK), date

### Scenarios and restrictions:

- Manager can CRUD Movies
- All Users can view Movies and a single Movie
- Customers can Buy Ticket, Watch Movie, Get Watch History
- Managers can list Rooms and TimeSlots
- Managers can CRUD Sessions
- Managers can get all users, get roles and assign role to a user
  - First registered user to the system is set as Manager, rest is Customer. First manager can assign roles to others.

### Testing:

- Unit tests are implemented for controllers and services by mocking any other required dependencies which is not related to that unit's test
- End to End tests are implemented by help of an In Memory SQLite database, all endpoints are covered including expected error throws

### Techincal Requirements:

- Written and tested on Node.js 16.13.2 and NestJS framework with Fastify Adapter
- PostgreSQL used for development and production tried on version 10 and 16.
- In memory SQLite used for end to end tests
- DTOs are used to validate user inputs
- Guards are used to control Authentication and Authorization
- Tried to ensure RESTful principles and naming conventions as much as I could.
- Used custom error handler across project
- Has Swagger for documentation
- Authorization and authentication is intact

### Missed Techinal Requirements:

- Project is written in a style that I'm used to. Couldn't find time to change it into Domain Driven Design but I think that it is not much different from that.

### Nice to Haves:

- Added some logic checks
  - Session entity has composite unique key for `timeSlotId`, `roomNumber` and `date` that ensures `A room should not be double-booked`
  - Added `Ticket` ownership for `Customer` and ensured that when a `Customer` tries to watch a movie with passing a `ticketId` service checks if the selected `Ticket` actually belongs to requesting `Customer`
  - Used `Customer`'s `age` property to check when `Customer` tries to buy a `Ticket` for a `Movie`. Rejecting operation if `Customer` is under age

### Missed nice to haves:

- Bulk CRUD operations on Movies: A simple task but didn't priotorize yet
- Sorting and filtereing opts for Movies: A simple task but didn't priotorize yet

### If I had more time:

- Complete nice to have features
- Enforce Regex Pattern on passwords
- Change code architecture for Domain-Driven Design
- Even if there is a custom error handling. I could add more expection handlers especially those throwen by Sequelize
- Add CRUD operations for Rooms and TimeSlots so that Manager can manage more
- Think about and add more logical checks if I could find more.
- Spend more time on Swagger documentation
- Add more test scenarios to cover more illegal operations from users

## How to Test

After completing [configuration requirements](README.md#configuration) mentioned on README file,

### Unit Testing

```bash
# unit tests
$ npm run test

# unit tests coverage
$ npm run test:cov
```

### E2E Testing

```bash
# e2e tests
$ npm run test:e2e

# e2e test coverage
$ npm run test:e2e:cov
```

### API Testing

By importing and using provided [Postman](https://www.postman.com/downloads/) collection in the repository

#### Collection Variables

- baseUrl: Base route address example: `http://localhost:5000/api` required in each Request
- managerToken: Token provided for `Manager` type of user.
- customerToken: Token provided for `Customer` type of user.

Instead of inheriting token from parent. Each requests set its own Authorization setting with these variables. In order to test forbidden accesses you can change variables or change Authentication method to `No Auth`

## How did it went?

Meeting database expectations and implementing endpoints are things that I'm used to, so I didn't struggle with those parts much. However as a developer who didn't wrote any unit or e2e test. I spend some time for this assignment to first grasp its concept. Misled by some sources at the beginning finally managed to understand how it should be done and tried to apply and cover every key functionality on the application.
