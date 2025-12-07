# Files Cần Xóa (Deprecated)

## Frontend - Old API Files

Các file sau đây đã được thay thế bằng API client mới trong `frontend/src/api/`:

- ❌ `frontend/src/api/MockData.ts` - Mock data cũ, không còn sử dụng
- ❌ `frontend/src/api/MovieAPI.ts` - API wrapper cũ, đã thay thế bằng `endpoints/movies.ts`

**Lý do xóa**: 
- Đã migrate sang API client mới với Axios interceptors
- Đã có các endpoint modules riêng biệt (movies, showtimes, bookings, auth)
- Không còn file nào import 2 file này

**Lệnh xóa**:
```powershell
Remove-Item frontend/src/api/MockData.ts
Remove-Item frontend/src/api/MovieAPI.ts
```

---

## Cấu Trúc Hiện Tại

### Backend
```
backend/src/
├── domain/               ✅ Domain layer (Clean Architecture)
├── application/          ✅ Use cases layer
├── infrastructure/       ✅ Technical implementations
├── modules/              ✅ Feature modules (NestJS)
├── common/               ✅ Shared utilities
├── config/               ✅ Configuration
└── database/             ✅ Database setup & seeders
```

### Frontend
```
frontend/src/
├── api/
│   ├── client.ts         ✅ Axios instance với interceptors
│   └── endpoints/        ✅ API endpoint modules
│       ├── auth.ts
│       ├── movies.ts
│       ├── showtimes.ts
│       └── bookings.ts
├── components/           ✅ Reusable UI components
├── features/             ✅ Feature-specific components
├── pages/                ✅ Page components
├── types/                ✅ TypeScript types
└── config/               ✅ Environment config
```

### Shared
```
shared/types/             ✅ Shared TypeScript types
├── movie.types.ts
├── booking.types.ts
├── showtime.types.ts
├── api.types.ts
└── index.ts
```

---

## Files Đã Kiểm Tra ✅

- ✅ Không có file `.spec.ts`, `.test.ts`, `.bak`, `.old` rác
- ✅ Path aliases `@/*` đã được config đúng trong `tsconfig.json`
- ✅ Tất cả imports sử dụng path aliases hoặc relative paths hợp lệ
- ✅ Đã tạo `index.ts` cho `application/` và `infrastructure/` layers
- ✅ Tất cả modules đều có cấu trúc đầy đủ (controllers, services, repositories, schemas, dtos)

---

## Kết Luận

Codebase đã sạch và có cấu trúc chuẩn. Chỉ cần xóa 2 file deprecated ở trên.
