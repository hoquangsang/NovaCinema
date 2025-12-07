# Giải Thích Chi Tiết Shared Folder

## 🎯 Mục Đích Chính

Folder `shared/` chứa các **type definitions** (định nghĩa kiểu dữ liệu) dùng chung giữa Backend (NestJS) và Frontend (React).

### Tại Sao Cần Shared Folder?

Trong dự án web, Backend và Frontend là 2 ứng dụng riêng biệt:
- **Backend**: Chạy trên Node.js server
- **Frontend**: Chạy trên trình duyệt

Khi Frontend gọi API của Backend, cần đảm bảo:
1. ✅ **Cấu trúc dữ liệu giống nhau** - Frontend gửi đúng format Backend expect
2. ✅ **Type safety** - TypeScript check lỗi ngay khi code
3. ✅ **Single source of truth** - Thay đổi một chỗ, cả 2 bên đều update
4. ✅ **Tránh lỗi runtime** - Catch lỗi lúc compile thay vì lúc chạy

---

## 📂 Cấu Trúc Chi Tiết

```
shared/
├── types/                          # Thư mục chính
│   ├── movie.types.ts             # Types cho Movie
│   ├── booking.types.ts           # Types cho Booking
│   ├── showtime.types.ts          # Types cho Showtime
│   ├── api.types.ts               # Types chung cho API
│   ├── index.ts                   # Export tất cả
│   ├── package.json               # Package config
│   ├── tsconfig.json              # TypeScript config
│   └── README.md                  # Hướng dẫn sử dụng
└── README.md                       # Tài liệu này
```

---

## 📄 Giải Thích Từng File

### 1. `movie.types.ts`

**Mục đích**: Định nghĩa các types cho Movie entity

**Nội dung**:
- `MovieDto` - Cấu trúc Movie trả về từ API
- `CreateMovieDto` - Dữ liệu cần gửi khi tạo movie mới
- `UpdateMovieDto` - Dữ liệu cần gửi khi update movie
- `QueryMoviesDto` - Parameters để query danh sách movies

**Ví dụ sử dụng**:
```typescript
// Frontend gọi API
const movie: MovieDto = await moviesApi.getMovieById('123');

// Backend controller
@Post()
create(@Body() dto: CreateMovieDto) {
  return this.movieService.create(dto);
}
```

---

### 2. `booking.types.ts`

**Mục đích**: Định nghĩa các types cho Booking entity

**Nội dung**:
- `BookingDto` - Cấu trúc booking trả về
- `CreateBookingDto` - Dữ liệu tạo booking
- `BookedSeatDto` - Thông tin ghế đã đặt
- `BookingStatus` - Enum trạng thái booking (pending, confirmed, cancelled, expired)
- `PaymentStatus` - Enum trạng thái thanh toán (pending, paid, failed, refunded)
- `PaymentMethod` - Enum phương thức thanh toán (credit_card, debit_card, e_wallet, bank_transfer, cash)

**Ví dụ sử dụng**:
```typescript
// Frontend
const booking: BookingDto = await bookingsApi.createBooking({
  showtimeId: '123',
  seatIds: ['seat1', 'seat2']
});

if (booking.status === BookingStatus.PENDING) {
  // Hiển thị timer 15 phút
}
```

---

### 3. `showtime.types.ts`

**Mục đích**: Định nghĩa các types cho Showtime entity

**Nội dung**:
- `ShowtimeDto` - Cấu trúc lịch chiếu
- `CreateShowtimeDto` - Dữ liệu tạo lịch chiếu
- `QueryShowtimesDto` - Parameters query lịch chiếu
- `ShowtimeStatus` - Enum trạng thái (scheduled, ongoing, completed, cancelled)

**Ví dụ sử dụng**:
```typescript
// Frontend lấy lịch chiếu của một phim
const showtimes: ShowtimeDto[] = await showtimesApi.getShowtimes({
  movieId: '123',
  startDate: '2025-12-07'
});
```

---

### 4. `api.types.ts`

**Mục đích**: Định nghĩa các types chung cho API responses

**Nội dung**:
- `ApiResponse<T>` - Response format chuẩn
- `PaginatedResponse<T>` - Response có phân trang
- `ApiError` - Cấu trúc error response

**Ví dụ**:
```typescript
// Tất cả API responses đều có format này
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Ví dụ response
{
  "success": true,
  "message": "Get movies successfully",
  "data": [{ movie1 }, { movie2 }],
  "timestamp": "2025-12-07T10:00:00Z"
}
```

---

### 5. `index.ts`

**Mục đích**: Export tất cả types để dễ import

**Nội dung**:
```typescript
export * from './movie.types';
export * from './booking.types';
export * from './showtime.types';
export * from './api.types';
```

**Lợi ích**: Chỉ cần import từ một nơi
```typescript
// Thay vì:
import { MovieDto } from '@shared/types/movie.types';
import { BookingDto } from '@shared/types/booking.types';

// Chỉ cần:
import { MovieDto, BookingDto } from '@shared/types';
```

---

### 6. `package.json`

**Mục đích**: Định nghĩa package cho shared types

**Nội dung**:
```json
{
  "name": "@novacinema/shared",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts"
}
```

**Giải thích**:
- Đặt tên package là `@novacinema/shared`
- Có thể publish lên npm nếu muốn (tương lai)
- `main` và `types` trỏ đến `index.ts`

---

### 7. `tsconfig.json`

**Mục đích**: Cấu hình TypeScript cho shared folder

**Nội dung chính**:
```json
{
  "compilerOptions": {
    "strict": true,
    "declaration": true,
    "esModuleInterop": true
  }
}
```

**Giải thích**:
- `strict: true` - Type checking nghiêm ngặt
- `declaration: true` - Tạo `.d.ts` files
- `esModuleInterop: true` - Tương thích imports

---

## 🔄 So Sánh Với Windows/.NET

### Trong Windows Desktop App (TechHaven):

```
TechHaven/
├── TechHaven.Domain/         # Business entities
├── TechHaven.Application/    # Business logic
├── TechHaven.Infrastructure/ # Data access
└── TechHaven.UI/             # WPF/WinForms

# Tất cả chạy trong 1 runtime (.NET)
# Có thể share CODE và LOGIC
```

### Trong Web App (NovaCinema):

```
NovaCinema/
├── backend/              # Node.js runtime
├── frontend/             # Browser runtime
└── shared/types/         # CHỈ SHARE TYPES, không share code

# 2 runtimes khác nhau!
# CHỈ có thể share TYPE DEFINITIONS
```

**Điểm khác biệt chính**:
- ❌ Windows: Share được CODE giữa các projects
- ✅ Web: Chỉ share được TYPE DEFINITIONS

**Lý do**: Backend chạy Node.js, Frontend chạy Browser - 2 môi trường hoàn toàn khác nhau!

---

## ✅ Quy Tắc Vàng

### NÊN làm:
✅ Định nghĩa interfaces
✅ Định nghĩa types
✅ Định nghĩa enums
✅ Định nghĩa constants types
✅ Giữ file nhẹ, chỉ types

### KHÔNG NÊN:
❌ Viết functions
❌ Viết classes với methods
❌ Import thư viện bên ngoài
❌ Sử dụng decorators (NestJS @IsString, etc.)
❌ Có business logic

---

## 🎯 Ví Dụ Thực Tế

### Khi Frontend Gọi API:

```typescript
// Frontend: src/api/endpoints/movies.ts
import { CreateMovieDto, MovieDto } from '@shared/types';

export const moviesApi = {
  async createMovie(data: CreateMovieDto): Promise<MovieDto> {
    const response = await apiClient.post('/movies', data);
    return response.data.data; // TypeScript biết đây là MovieDto
  }
};
```

### Khi Backend Nhận Request:

```typescript
// Backend: src/modules/movies/controllers/movies.controller.ts
import { CreateMovieDto, MovieDto } from '@shared/types';

@Controller('movies')
export class MoviesController {
  @Post()
  async create(@Body() dto: CreateMovieDto): Promise<MovieDto> {
    // TypeScript biết cấu trúc của dto
    return this.moviesService.create(dto);
  }
}
```

### Lợi Ích:

1. **Nếu thay đổi MovieDto** trong shared:
   - ✅ Backend tự động biết
   - ✅ Frontend tự động biết
   - ✅ TypeScript báo lỗi ngay nếu code cũ không tương thích

2. **Auto-complete trong IDE**:
   - ✅ Frontend gõ `dto.` là VSCode suggest tất cả fields
   - ✅ Backend gõ `dto.` cũng suggest giống nhau

3. **Refactoring an toàn**:
   - ✅ Đổi tên field trong shared → tất cả nơi dùng đều báo lỗi
   - ✅ Fix hết lỗi → đảm bảo không bị sót

---

## 🚀 Cách Thêm Type Mới

### Bước 1: Tạo file mới (nếu cần)

```bash
# Ví dụ thêm Payment types
touch shared/types/payment.types.ts
```

### Bước 2: Định nghĩa types

```typescript
// shared/types/payment.types.ts
export interface PaymentDto {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
}

export interface CreatePaymentDto {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  E_WALLET = 'e_wallet',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}
```

### Bước 3: Export trong index.ts

```typescript
// shared/types/index.ts
export * from './payment.types'; // Thêm dòng này
```

### Bước 4: Sử dụng

```typescript
// Backend hoặc Frontend
import { PaymentDto, CreatePaymentDto } from '@shared/types';
```

---

## 🎓 Kết Luận

**Shared folder** là giải pháp để:
1. ✅ Đồng bộ types giữa Backend và Frontend
2. ✅ Tránh lỗi type mismatch
3. ✅ Tăng productivity với auto-complete
4. ✅ Refactoring an toàn
5. ✅ Single source of truth

**Giống như**: Windows có shared project cho DTOs, Web có shared types cho TypeScript definitions.

**Khác nhau**: Windows share được code, Web chỉ share được types.

---

## 📚 Tham Khảo

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **Monorepo với TypeScript**: https://www.typescriptlang.org/docs/handbook/project-references.html
- **API Contract Design**: https://martinfowler.com/articles/richardsonMaturityModel.html
