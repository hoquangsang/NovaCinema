# NovaCinema - Software Architecture Documentation

## Overview

NovaCinema is a modern movie ticket booking system built with a **3-Tier Architecture** that separates concerns across three distinct layers: **Presentation**, **Application/Business Logic**, and **Data Access**.

The system follows **Clean Architecture** principles and industry best practices including:
- Domain-Driven Design (DDD)
- Repository Pattern
- Use Case Pattern
- Dependency Inversion
- Separation of Concerns

---

## Architecture Layers

### 1. Presentation Layer (API/Controllers)

**Purpose**: Handle HTTP requests, validate input, format responses

**Location**: `backend/src/modules/*/controllers/`

**Responsibilities**:
- HTTP request/response handling
- Input validation (DTOs with class-validator)
- Authentication & Authorization (Guards)
- API documentation (Swagger/OpenAPI)
- Response formatting (Interceptors)

**Example**:
```typescript
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto, @CurrentUser() user) {
    return this.bookingService.createBooking({ ...dto, userId: user.id });
  }
}
```

**Key Components**:
- Controllers: Handle routes and HTTP
- DTOs (Data Transfer Objects): Define request/response shapes
- Guards: Protect routes (JWT, Roles)
- Interceptors: Transform responses, log requests
- Filters: Handle exceptions globally

---

### 2. Application/Business Logic Layer

**Purpose**: Implement business rules and orchestrate domain operations

**Location**: 
- Services: `backend/src/modules/*/services/`
- Use Cases: `backend/src/application/use-cases/`

**Responsibilities**:
- Business logic implementation
- Transaction management
- Domain model orchestration
- Complex workflows
- Business rule validation

**Structure**:

#### Services
Handle module-specific business logic:
```typescript
@Injectable()
export class BookingService {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async createBooking(params) {
    return this.createBookingUseCase.execute(params);
  }
}
```

#### Use Cases
Encapsulate single business operations:
```typescript
@Injectable()
export class CreateBookingUseCase {
  async execute(input: CreateBookingInput) {
    // 1. Validate showtime
    // 2. Verify seat availability
    // 3. Calculate price
    // 4. Create booking
    // 5. Reserve seats
    // 6. Return booking
  }
}
```

**Key Patterns**:
- **Use Case Pattern**: One class per business operation
- **Service Layer**: Orchestrates use cases
- **Domain Services**: Business logic that doesn't belong to a single entity

---

### 3. Data Access Layer

**Purpose**: Manage database operations and persistence

**Location**:
- Schemas: `backend/src/modules/*/schemas/`
- Repositories: `backend/src/modules/*/repositories/`
- Domain Models: `backend/src/domain/models/`

**Responsibilities**:
- Database queries
- Data persistence
- Entity mapping
- Transaction management

**Structure**:

#### Domain Models (Pure Business Entities)
```typescript
export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly showtimeId: string,
    public readonly totalAmount: number,
    // ... other properties
  ) {}

  // Business methods
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canBeCancelled(): boolean {
    return this.status === 'confirmed' || this.status === 'pending';
  }
}
```

#### MongoDB Schemas (Database Structure)
```typescript
@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalAmount: number;
  // ... database fields
}
```

#### Repositories (Data Access)
```typescript
@Injectable()
export class BookingRepository extends BaseRepository<Booking, BookingDocument> {
  async findByUserId(userId: string, page: number, limit: number) {
    return this.findPaginated({ filter: { userId }, page, limit });
  }

  async confirmBooking(bookingId: string, paymentId: string) {
    return this.updateById(bookingId, {
      status: 'confirmed',
      paymentId,
      confirmedAt: new Date(),
    });
  }
}
```

**Key Patterns**:
- **Repository Pattern**: Abstracts data access
- **Base Repository**: Provides common CRUD operations
- **Data Mapper**: Converts between domain models and database documents

---

## Domain Layer (NEW)

**Purpose**: Core business logic independent of infrastructure

**Location**: `backend/src/domain/`

**Contents**:
- `models/`: Pure domain entities with business methods
- `interfaces/`: Contracts for repositories and services

**Benefits**:
- Framework-independent business logic
- Testable without database
- Clear business rules
- Reusable across projects

**Example**:
```typescript
// Domain Model
export class Showtime {
  isBookable(): boolean {
    const now = new Date();
    return (
      this.status === 'scheduled' &&
      this.startTime > now &&
      this.availableSeats > 0
    );
  }

  isBookingWindowOpen(minutesBeforeStart: number = 15): boolean {
    const deadline = new Date(this.startTime);
    deadline.setMinutes(deadline.getMinutes() - minutesBeforeStart);
    return new Date() < deadline;
  }
}
```

---

## Module Structure

Each feature module follows this structure:

```
modules/
├── bookings/
│   ├── bookings.module.ts          # Module definition
│   ├── controllers/
│   │   └── bookings.controller.ts  # HTTP endpoints
│   ├── services/
│   │   └── booking.service.ts      # Business logic
│   ├── repositories/
│   │   └── booking.repository.ts   # Data access
│   ├── schemas/
│   │   └── booking.schema.ts       # MongoDB schema
│   └── dtos/
│       └── index.ts                # Request/Response DTOs
```

---

## Cross-Cutting Concerns

### Common Module
**Location**: `backend/src/common/`

Provides reusable utilities across all layers:

- **Guards**: Authentication & Authorization
  - `JwtAuthGuard`: Validates JWT tokens
  - `RolesGuard`: Checks user roles

- **Interceptors**: Request/Response processing
  - `LoggingInterceptor`: Logs all requests
  - `ResponseInterceptor`: Formats responses

- **Filters**: Error handling
  - `HttpExceptionFilter`: Handles HTTP errors
  - `MongoExceptionFilter`: Handles database errors

- **Pipes**: Input validation & transformation
  - `ValidationPipe`: Validates DTOs

- **Decorators**: Metadata & utilities
  - `@CurrentUser()`: Extract user from request
  - `@Roles()`: Define required roles
  - `@Public()`: Skip authentication

### Configuration
**Location**: `backend/src/config/`

Centralized configuration management:
- `app.config.ts`: Application settings
- `jwt.access.config.ts`: JWT access token config
- `jwt.refresh.config.ts`: JWT refresh token config
- `swagger.config.ts`: API documentation

---

## Core Modules

### 1. Users Module
Manages user accounts and profiles.

**Entities**: User
**Operations**: Register, update profile, manage account

### 2. Auth Module
Handles authentication and authorization.

**Operations**: Login, logout, refresh token, verify email, reset password

### 3. Movies Module
Manages movie catalog.

**Entities**: Movie
**Operations**: CRUD movies, search, filter by genre, get showing/upcoming

### 4. Theaters Module
Manages cinema locations and screening rooms.

**Entities**: Theater, Room, Seat
**Operations**: CRUD theaters, manage rooms, manage seats

### 5. Showtimes Module (NEW)
Manages movie screening schedules.

**Entities**: Showtime
**Operations**: Create schedules, get available showtimes, update status

### 6. Bookings Module (NEW)
Handles ticket reservations and payments.

**Entities**: Booking
**Operations**: Create booking, confirm payment, cancel booking, view history

---

## Data Flow Example: Create Booking

```
1. Client Request
   POST /api/bookings
   { showtimeId, seatIds }
   
2. Presentation Layer
   BookingsController.createBooking()
   - Validates DTO
   - Extracts user from JWT
   - Calls service
   
3. Application Layer
   BookingService.createBooking()
   -> CreateBookingUseCase.execute()
      - Validates showtime exists and is bookable
      - Checks seat availability
      - Calculates total price
      - Creates booking record
      - Reserves seats
      - Updates showtime available seats
      - Returns booking
      
4. Data Layer
   BookingRepository.create()
   SeatRepository.bulkUpdateStatus()
   ShowtimeRepository.updateAvailableSeats()
   - Executes database operations
   - Maps domain models to DB documents
   - Returns results
   
5. Response
   Booking created successfully
   { bookingCode, expiresAt, totalAmount, ... }
```

---

## Design Patterns Used

### 1. Repository Pattern
Abstracts data access, making it easy to swap databases.

### 2. Use Case Pattern (Interactor)
Encapsulates single business operations, following Single Responsibility Principle.

### 3. Dependency Injection
Framework-managed dependencies for loose coupling.

### 4. Data Mapper Pattern
Separates domain models from database schemas.

### 5. Strategy Pattern
Used in payment processing (different payment gateways).

### 6. Decorator Pattern
NestJS decorators for metadata and cross-cutting concerns.

---

## SOLID Principles

- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable
- **Interface Segregation**: Many specific interfaces > one general
- **Dependency Inversion**: Depend on abstractions, not concretions

---

## Database Schema

### Collections:

1. **users**: User accounts
2. **movies**: Movie catalog
3. **theaters**: Cinema locations
4. **rooms**: Screening rooms in theaters
5. **seats**: Individual seats in rooms
6. **showtimes**: Movie screening schedules
7. **bookings**: Ticket reservations
8. **otps**: One-time passwords for verification

### Relationships:

```
Theater (1) ──< (N) Room
Room (1) ──< (N) Seat
Movie (1) ──< (N) Showtime
Room (1) ──< (N) Showtime
Theater (1) ──< (N) Showtime
User (1) ──< (N) Booking
Showtime (1) ──< (N) Booking
Booking (1) ──< (N) BookedSeat
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email with OTP

### Movies
- `GET /api/movies/showing` - Get showing movies
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Create movie (Admin)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get theater details
- `GET /api/theaters/:id/rooms` - Get rooms in theater

### Showtimes
- `GET /api/showtimes?movieId=&theaterId=` - Get showtimes
- `GET /api/showtimes/:id` - Get showtime details
- `POST /api/showtimes` - Create showtime (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id/confirm` - Confirm booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details

---

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Role-Based Access Control (RBAC)**: Admin/User roles
3. **Password Hashing**: Bcrypt with salt
4. **Email Verification**: OTP-based verification
5. **Input Validation**: class-validator on all DTOs
6. **Rate Limiting**: Prevent abuse
7. **CORS**: Configured allowed origins

---

## Error Handling

Centralized error handling with custom filters:

```typescript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email must be valid"
    }
  ],
  "timestamp": "2025-12-07T10:30:00Z",
  "path": "/api/auth/register"
}
```

---

## Response Format

Consistent API responses:

```typescript
// Success
{
  "success": true,
  "message": "Booking created successfully",
  "data": { ... },
  "timestamp": "2025-12-07T10:30:00Z"
}

// Paginated
{
  "success": true,
  "data": {
    "items": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Future Enhancements

1. **Caching Layer**: Redis for frequently accessed data
2. **Event-Driven Architecture**: Message queues for async operations
3. **Microservices**: Split into independent services
4. **GraphQL**: Alternative to REST API
5. **WebSockets**: Real-time seat availability
6. **Payment Gateway Integration**: Stripe, PayPal, etc.
7. **Notification Service**: Email/SMS notifications
8. **Admin Dashboard**: Separate admin frontend
9. **Analytics**: Booking trends, revenue reports
10. **Mobile App**: React Native or Flutter

---

## Development Best Practices

1. **Code Organization**: Feature-based modules
2. **Naming Conventions**: Clear, descriptive names
3. **Type Safety**: Full TypeScript coverage
4. **Error Handling**: Comprehensive try-catch blocks
5. **Logging**: Structured logging for debugging
6. **Testing**: Unit tests for use cases and services
7. **Documentation**: Swagger for API, JSDoc for code
8. **Version Control**: Git with feature branches
9. **Code Review**: PR reviews before merging
10. **CI/CD**: Automated testing and deployment

---

## Running the Application

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation
```bash
cd backend
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### API Documentation
Access Swagger UI at: `http://localhost:3000/api/docs`

---

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable and maintainable codebase
- ✅ Testable business logic
- ✅ Framework-independent domain
- ✅ Industry-standard patterns
- ✅ Production-ready structure

The 3-tier architecture with domain layer ensures the application can grow and adapt to changing requirements while maintaining code quality and developer productivity.
