# Kiến Trúc Phần Mềm NovaCinema

## Tổng Quan

NovaCinema là hệ thống đặt vé xem phim hiện đại được xây dựng với **Kiến trúc 3 tầng (3-Tier Architecture)** để phân tách rõ ràng giữa các tầng: **Giao diện (Presentation)**, **Nghiệp vụ (Business Logic)**, và **Dữ liệu (Data Access)**.

Hệ thống tuân theo các nguyên tắc **Clean Architecture** và các best practices trong ngành bao gồm:

- Domain-Driven Design (DDD) - Thiết kế hướng miền
- Repository Pattern - Mẫu kho lưu trữ
- Use Case Pattern - Mẫu ca sử dụng
- Dependency Inversion - Đảo ngược phụ thuộc
- Separation of Concerns - Phân tách trách nhiệm

---

## Các Tầng Kiến Trúc

### 1. Tầng Giao Diện (Presentation Layer)

**Mục đích**: Xử lý HTTP requests, validate dữ liệu đầu vào, format responses

**Vị trí**: `backend/src/modules/*/controllers/`

**Trách nhiệm**:

- Xử lý HTTP request/response
- Validate dữ liệu đầu vào (DTOs với class-validator)
- Xác thực & Phân quyền (Guards)
- Tài liệu API (Swagger/OpenAPI)
- Format response (Interceptors)

**Ví dụ**:

```typescript
@ApiTags("bookings")
@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto, @CurrentUser() user) {
    return this.bookingService.createBooking({ ...dto, userId: user.id });
  }
}
```

**Các thành phần chính**:

- **Controllers**: Xử lý routes và HTTP
- **DTOs**: Định nghĩa cấu trúc request/response
- **Guards**: Bảo vệ routes (JWT, Roles)
- **Interceptors**: Chuyển đổi responses, log requests
- **Filters**: Xử lý exceptions toàn cục

---

### 2. Tầng Nghiệp Vụ (Application/Business Logic Layer)

**Mục đích**: Triển khai các quy tắc nghiệp vụ và điều phối các thao tác domain

**Vị trí**:

- Services: `backend/src/modules/*/services/`
- Use Cases: `backend/src/application/use-cases/`

**Trách nhiệm**:

- Triển khai logic nghiệp vụ
- Quản lý transactions
- Điều phối domain models
- Workflows phức tạp
- Validate quy tắc nghiệp vụ

**Cấu trúc**:

#### Services (Dịch vụ)

Xử lý logic nghiệp vụ cụ thể của module:

```typescript
@Injectable()
export class BookingService {
  constructor(
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly bookingRepo: BookingRepository
  ) {}

  async createBooking(params) {
    return this.createBookingUseCase.execute(params);
  }
}
```

#### Use Cases (Ca sử dụng)

Đóng gói một nghiệp vụ đơn lẻ:

```typescript
@Injectable()
export class CreateBookingUseCase {
  async execute(input: CreateBookingInput) {
    // 1. Validate showtime
    // 2. Kiểm tra ghế còn trống
    // 3. Tính tiền
    // 4. Tạo booking
    // 5. Giữ chỗ
    // 6. Trả về booking
  }
}
```

**Các mẫu thiết kế**:

- **Use Case Pattern**: Một class cho một nghiệp vụ
- **Service Layer**: Điều phối các use cases
- **Domain Services**: Logic nghiệp vụ không thuộc về một entity cụ thể

---

### 3. Tầng Truy Cập Dữ Liệu (Data Access Layer)

**Mục đích**: Quản lý các thao tác database và lưu trữ

**Vị trí**:

- Schemas: `backend/src/modules/*/schemas/`
- Repositories: `backend/src/modules/*/repositories/`
- Domain Models: `backend/src/domain/models/`

**Trách nhiệm**:

- Truy vấn database
- Lưu trữ dữ liệu
- Mapping entities
- Quản lý transactions

**Cấu trúc**:

#### Domain Models (Entities nghiệp vụ thuần túy)

```typescript
export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly showtimeId: string,
    public readonly totalAmount: number // ... các thuộc tính khác
  ) {}

  // Các phương thức nghiệp vụ
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  canBeCancelled(): boolean {
    return this.status === "confirmed" || this.status === "pending";
  }
}
```

#### MongoDB Schemas (Cấu trúc database)

```typescript
@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalAmount: number;
  // ... các trường database
}
```

#### Repositories (Truy cập dữ liệu)

```typescript
@Injectable()
export class BookingRepository extends BaseRepository<
  Booking,
  BookingDocument
> {
  async findByUserId(userId: string, page: number, limit: number) {
    return this.findPaginated({ filter: { userId }, page, limit });
  }

  async confirmBooking(bookingId: string, paymentId: string) {
    return this.updateById(bookingId, {
      status: "confirmed",
      paymentId,
      confirmedAt: new Date(),
    });
  }
}
```

**Các mẫu thiết kế**:

- **Repository Pattern**: Trừu tượng hóa truy cập dữ liệu
- **Base Repository**: Cung cấp các thao tác CRUD chung
- **Data Mapper**: Chuyển đổi giữa domain models và database documents

---

## Tầng Domain

**Mục đích**: Logic nghiệp vụ cốt lõi độc lập với infrastructure

**Vị trí**: `backend/src/domain/`

**Nội dung**:

- `models/`: Domain entities thuần túy với các phương thức nghiệp vụ
- `interfaces/`: Các contracts cho repositories và services

**Lợi ích**:

- Logic nghiệp vụ độc lập với framework
- Dễ test không cần database
- Quy tắc nghiệp vụ rõ ràng
- Có thể tái sử dụng cho nhiều dự án

**Ví dụ**:

```typescript
// Domain Model
export class Showtime {
  isBookable(): boolean {
    const now = new Date();
    return (
      this.status === "scheduled" &&
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

## Cấu Trúc Module

Mỗi feature module tuân theo cấu trúc:

```
modules/
├── bookings/
│   ├── bookings.module.ts          # Định nghĩa module
│   ├── controllers/
│   │   └── bookings.controller.ts  # HTTP endpoints
│   ├── services/
│   │   └── booking.service.ts      # Logic nghiệp vụ
│   ├── repositories/
│   │   └── booking.repository.ts   # Truy cập dữ liệu
│   ├── schemas/
│   │   └── booking.schema.ts       # MongoDB schema
│   └── dtos/
│       └── index.ts                # Request/Response DTOs
```

---

## Các Module Chính

### 1. Users Module

Quản lý tài khoản và profiles người dùng.

**Entities**: User
**Nghiệp vụ**: Đăng ký, cập nhật profile, quản lý tài khoản

### 2. Auth Module

Xử lý xác thực và phân quyền.

**Nghiệp vụ**: Đăng nhập, đăng xuất, refresh token, xác thực email, reset mật khẩu

### 3. Movies Module

Quản lý danh mục phim.

**Entities**: Movie
**Nghiệp vụ**: CRUD phim, tìm kiếm, lọc theo thể loại, lấy phim đang chiếu/sắp chiếu

### 4. Theaters Module

Quản lý rạp chiếu và phòng chiếu.

**Entities**: Theater, Room, Seat
**Nghiệp vụ**: CRUD rạp, quản lý phòng, quản lý ghế

### 5. Showtimes Module (MỚI)

Quản lý lịch chiếu phim.

**Entities**: Showtime
**Nghiệp vụ**: Tạo lịch chiếu, lấy lịch khả dụng, cập nhật trạng thái

### 6. Bookings Module (MỚI)

Xử lý đặt vé và thanh toán.

**Entities**: Booking
**Nghiệp vụ**: Đặt vé, xác nhận thanh toán, hủy vé, xem lịch sử

---

## Luồng Dữ Liệu: Đặt Vé

```
1. Client gửi request
   POST /api/bookings
   { showtimeId, seatIds }

2. Tầng Giao Diện
   BookingsController.createBooking()
   - Validate DTO
   - Lấy user từ JWT
   - Gọi service

3. Tầng Nghiệp Vụ
   BookingService.createBooking()
   -> CreateBookingUseCase.execute()
      - Validate showtime tồn tại và có thể đặt
      - Kiểm tra ghế còn trống
      - Tính tổng tiền
      - Tạo booking record
      - Giữ chỗ
      - Cập nhật số ghế trống
      - Trả về booking

4. Tầng Dữ Liệu
   BookingRepository.create()
   SeatRepository.bulkUpdateStatus()
   ShowtimeRepository.updateAvailableSeats()
   - Thực thi các thao tác database
   - Map domain models sang DB documents
   - Trả về kết quả

5. Response
   Đặt vé thành công
   { bookingCode, expiresAt, totalAmount, ... }
```

---

## Các Mẫu Thiết Kế Được Sử Dụng

### 1. Repository Pattern

Trừu tượng hóa truy cập dữ liệu, dễ dàng thay đổi database.

### 2. Use Case Pattern (Interactor)

Đóng gói một nghiệp vụ đơn lẻ, tuân theo Single Responsibility Principle.

### 3. Dependency Injection

Framework quản lý dependencies để giảm coupling.

### 4. Data Mapper Pattern

Tách biệt domain models khỏi database schemas.

### 5. Strategy Pattern

Dùng trong xử lý thanh toán (các payment gateways khác nhau).

### 6. Decorator Pattern

NestJS decorators cho metadata và cross-cutting concerns.

---

## Nguyên Tắc SOLID

- **Single Responsibility**: Mỗi class có một lý do duy nhất để thay đổi
- **Open/Closed**: Mở cho mở rộng, đóng cho sửa đổi
- **Liskov Substitution**: Subtypes có thể thay thế được
- **Interface Segregation**: Nhiều interface cụ thể > một interface tổng quát
- **Dependency Inversion**: Phụ thuộc vào abstractions, không phải concretions

---

## Schema Database

### Collections:

1. **users**: Tài khoản người dùng
2. **movies**: Danh mục phim
3. **theaters**: Rạp chiếu
4. **rooms**: Phòng chiếu trong rạp
5. **seats**: Ghế trong phòng
6. **showtimes**: Lịch chiếu phim
7. **bookings**: Đặt vé
8. **otps**: Mã xác thực một lần

### Quan hệ:

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

## Tính Năng Bảo Mật

1. **JWT Authentication**: Xác thực bằng token
2. **Role-Based Access Control (RBAC)**: Phân quyền Admin/User
3. **Password Hashing**: Mã hóa mật khẩu với Bcrypt
4. **Email Verification**: Xác thực bằng OTP
5. **Input Validation**: Validate tất cả DTOs với class-validator
6. **Rate Limiting**: Ngăn chặn spam
7. **CORS**: Cấu hình origins được phép

---

## Xử Lý Lỗi

Xử lý lỗi tập trung với custom filters:

```typescript
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email phải hợp lệ"
    }
  ],
  "timestamp": "2025-12-07T10:30:00Z",
  "path": "/api/auth/register"
}
```

---

## Format Response

Response API nhất quán:

```typescript
// Success
{
  "success": true,
  "message": "Đặt vé thành công",
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
