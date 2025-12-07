# Git Commit Strategy - NovaCinema Refactoring

## 📋 Tổng Quan

Chia **60+ file changes** thành **12 commits** logic, tuân theo **Conventional Commits**.

---

## ✅ Danh Sách Commits

### Commit 1: feat(backend): add domain layer with business models

**Mô tả**: Thêm tầng Domain với các domain models và interfaces

**Files**:
```bash
git add backend/src/domain/
```

**Commit message**:
```
feat(backend): add domain layer with business models

- Add 7 domain models: Movie, Theater, Room, Seat, User, Showtime, Booking
- Add domain interfaces for repositories and services
- Implement business methods in models (isBookable, canBeCancelled, etc.)
- Framework-independent pure business logic
```

---

### Commit 2: feat(backend): add infrastructure layer with data mappers

**Mô tả**: Thêm tầng Infrastructure với mappers

**Files**:
```bash
git add backend/src/infrastructure/
```

**Commit message**:
```
feat(backend): add infrastructure layer with data mappers

- Add data mappers for Movie, Showtime, Booking
- Implement toDomain() and toPersistence() methods
- Separate domain models from database documents
```

---

### Commit 3: feat(backend): add application layer with use cases

**Mô tả**: Thêm tầng Application với use cases

**Files**:
```bash
git add backend/src/application/
```

**Commit message**:
```
feat(backend): add application layer with use cases

- Add CreateBookingUseCase with seat validation and price calculation
- Add ConfirmBookingUseCase for payment processing
- Add CancelBookingUseCase with refund logic
- Implement complex business workflows
```

---

### Commit 4: refactor(backend): enhance base repository and seat repository

**Mô tả**: Nâng cấp BaseRepository và SeatRepository

**Files**:
```bash
git add backend/src/modules/shared/repositories/base.repository.ts
git add backend/src/modules/theaters/repositories/seat.repository.ts
```

**Commit message**:
```
refactor(backend): enhance base repository and seat repository

- Change BaseRepository methods from protected to public
- Add findByIds() method to BaseRepository
- Add bulkUpdateStatus() to SeatRepository for reservations
- Add findAvailableSeats() to SeatRepository
```

---

### Commit 5: feat(backend): add showtimes module

**Mô tả**: Thêm module Showtimes hoàn chỉnh

**Files**:
```bash
git add backend/src/modules/showtimes/
```

**Commit message**:
```
feat(backend): add showtimes module

- Add ShowtimeController with CRUD endpoints
- Add ShowtimeService with business logic
- Add ShowtimeRepository with specialized queries
- Add Showtime schema with indexes
- Add ShowtimeDto for API responses
- Implement findBookableShowtimes functionality
```

---

### Commit 6: feat(backend): add bookings module

**Mô tả**: Thêm module Bookings hoàn chỉnh

**Files**:
```bash
git add backend/src/modules/bookings/
```

**Commit message**:
```
feat(backend): add bookings module

- Add BookingsController with create, confirm, cancel endpoints
- Add BookingService integrating use cases
- Add BookingRepository with booking code generation
- Add Booking schema with compound indexes
- Add BookingDto and CreateBookingDto
- Implement 15-minute expiration logic
```

---

### Commit 7: chore(backend): update app module and configuration

**Mô tả**: Cập nhật AppModule và config

**Files**:
```bash
git add backend/src/app.module.ts
git add backend/src/config/app.config.ts
git add backend/src/modules/theaters/theaters.module.ts
git add backend/tsconfig.json
```

**Commit message**:
```
chore(backend): update app module and configuration

- Import ShowtimesModule and BookingsModule in AppModule
- Add centralized app.config.ts
- Configure TypeScript path aliases (@/domain, @/application, etc.)
- Export ShowtimeRepository in TheatersModule
```

---

### Commit 8: feat(frontend): add API client with axios interceptors

**Mô tả**: Thêm API client cho frontend

**Files**:
```bash
git add frontend/src/api/client.ts
git add frontend/src/api/endpoints/
git add frontend/src/config/
git add frontend/.env.example
```

**Commit message**:
```
feat(frontend): add API client with axios interceptors

- Add axios client with request/response interceptors
- Add automatic token refresh on 401
- Add type-safe API endpoints for movies, showtimes, bookings, auth
- Add environment configuration
- Update .env.example with VITE_API_BASE_URL
```

---

### Commit 9: refactor(frontend): migrate to new API client

**Mô tả**: Migrate frontend components sang API client mới

**Files**:
```bash
git add frontend/src/pages/MovieDetailPage.tsx
git add frontend/src/features/movies/NowShowing.tsx
git add frontend/src/features/movies/ComingSoon.tsx
```

**Commit message**:
```
refactor(frontend): migrate to new API client

- Update MovieDetailPage to use moviesApi
- Update NowShowing to use moviesApi.getShowingMovies()
- Update ComingSoon to use moviesApi.getUpcomingMovies()
- Remove deprecated imports
```

---

### Commit 10: chore(frontend): remove deprecated files

**Mô tả**: Xóa các file cũ không dùng nữa

**Files**:
```bash
git add frontend/src/api/MockData.ts
git add frontend/src/api/MovieAPI.ts
```

**Commit message**:
```
chore(frontend): remove deprecated API files

- Remove MockData.ts (replaced by backend API)
- Remove MovieAPI.ts (replaced by new API client)
```

---

### Commit 11: feat: add shared types package

**Mô tả**: Thêm shared types cho cả backend và frontend

**Files**:
```bash
git add shared/
```

**Commit message**:
```
feat: add shared types package

- Add shared TypeScript types for Movie, Booking, Showtime
- Add common API response types
- Add package.json and tsconfig.json for shared package
- Add comprehensive README for usage guidelines
```

---

### Commit 12: docs: add comprehensive architecture documentation

**Mô tả**: Thêm tất cả tài liệu

**Files**:
```bash
git add ARCHITECTURE.md
git add ARCHITECTURE_VI.md
git add REFACTORING_SUMMARY.md
git add REFACTORING_SUMMARY_VI.md
git add QUICK_START.md
git add QUICK_START_VI.md
git add DIAGRAMS.md
git add DIAGRAMS_VI.md
git add CLEANUP.md
git add SHARED_EXPLAINED.md
git add frontend/FRONTEND_ARCHITECTURE.md
```

**Commit message**:
```
docs: add comprehensive architecture documentation

- Add ARCHITECTURE.md explaining 3-tier architecture
- Add Vietnamese translations for all documentation
- Add REFACTORING_SUMMARY.md with changes overview
- Add QUICK_START.md for developers
- Add DIAGRAMS.md with system diagrams
- Add SHARED_EXPLAINED.md explaining shared types
- Add FRONTEND_ARCHITECTURE.md for frontend structure
- Add CLEANUP.md noting deprecated files
```

---

## 🚀 Script Để Chạy Tất Cả Commits

Lưu script này vào `commit-all.ps1`:

```powershell
# Commit 1: Domain Layer
git add backend/src/domain/
git commit -m "feat(backend): add domain layer with business models

- Add 7 domain models: Movie, Theater, Room, Seat, User, Showtime, Booking
- Add domain interfaces for repositories and services
- Implement business methods in models (isBookable, canBeCancelled, etc.)
- Framework-independent pure business logic"

# Commit 2: Infrastructure Layer
git add backend/src/infrastructure/
git commit -m "feat(backend): add infrastructure layer with data mappers

- Add data mappers for Movie, Showtime, Booking
- Implement toDomain() and toPersistence() methods
- Separate domain models from database documents"

# Commit 3: Application Layer
git add backend/src/application/
git commit -m "feat(backend): add application layer with use cases

- Add CreateBookingUseCase with seat validation and price calculation
- Add ConfirmBookingUseCase for payment processing
- Add CancelBookingUseCase with refund logic
- Implement complex business workflows"

# Commit 4: Repository Enhancements
git add backend/src/modules/shared/repositories/base.repository.ts
git add backend/src/modules/theaters/repositories/seat.repository.ts
git commit -m "refactor(backend): enhance base repository and seat repository

- Change BaseRepository methods from protected to public
- Add findByIds() method to BaseRepository
- Add bulkUpdateStatus() to SeatRepository for reservations
- Add findAvailableSeats() to SeatRepository"

# Commit 5: Showtimes Module
git add backend/src/modules/showtimes/
git commit -m "feat(backend): add showtimes module

- Add ShowtimeController with CRUD endpoints
- Add ShowtimeService with business logic
- Add ShowtimeRepository with specialized queries
- Add Showtime schema with indexes
- Add ShowtimeDto for API responses
- Implement findBookableShowtimes functionality"

# Commit 6: Bookings Module
git add backend/src/modules/bookings/
git commit -m "feat(backend): add bookings module

- Add BookingsController with create, confirm, cancel endpoints
- Add BookingService integrating use cases
- Add BookingRepository with booking code generation
- Add Booking schema with compound indexes
- Add BookingDto and CreateBookingDto
- Implement 15-minute expiration logic"

# Commit 7: Backend Configuration
git add backend/src/app.module.ts
git add backend/src/config/app.config.ts
git add backend/src/modules/theaters/theaters.module.ts
git add backend/tsconfig.json
git commit -m "chore(backend): update app module and configuration

- Import ShowtimesModule and BookingsModule in AppModule
- Add centralized app.config.ts
- Configure TypeScript path aliases (@/domain, @/application, etc.)
- Export ShowtimeRepository in TheatersModule"

# Commit 8: Frontend API Client
git add frontend/src/api/client.ts
git add frontend/src/api/endpoints/
git add frontend/src/config/
git add frontend/.env.example
git commit -m "feat(frontend): add API client with axios interceptors

- Add axios client with request/response interceptors
- Add automatic token refresh on 401
- Add type-safe API endpoints for movies, showtimes, bookings, auth
- Add environment configuration
- Update .env.example with VITE_API_BASE_URL"

# Commit 9: Frontend Migration
git add frontend/src/pages/MovieDetailPage.tsx
git add frontend/src/features/movies/NowShowing.tsx
git add frontend/src/features/movies/ComingSoon.tsx
git commit -m "refactor(frontend): migrate to new API client

- Update MovieDetailPage to use moviesApi
- Update NowShowing to use moviesApi.getShowingMovies()
- Update ComingSoon to use moviesApi.getUpcomingMovies()
- Remove deprecated imports"

# Commit 10: Remove Deprecated
git add frontend/src/api/MockData.ts
git add frontend/src/api/MovieAPI.ts
git commit -m "chore(frontend): remove deprecated API files

- Remove MockData.ts (replaced by backend API)
- Remove MovieAPI.ts (replaced by new API client)"

# Commit 11: Shared Types
git add shared/
git commit -m "feat: add shared types package

- Add shared TypeScript types for Movie, Booking, Showtime
- Add common API response types
- Add package.json and tsconfig.json for shared package
- Add comprehensive README for usage guidelines"

# Commit 12: Documentation
git add ARCHITECTURE.md ARCHITECTURE_VI.md REFACTORING_SUMMARY.md REFACTORING_SUMMARY_VI.md QUICK_START.md QUICK_START_VI.md DIAGRAMS.md DIAGRAMS_VI.md CLEANUP.md SHARED_EXPLAINED.md frontend/FRONTEND_ARCHITECTURE.md
git commit -m "docs: add comprehensive architecture documentation

- Add ARCHITECTURE.md explaining 3-tier architecture
- Add Vietnamese translations for all documentation
- Add REFACTORING_SUMMARY.md with changes overview
- Add QUICK_START.md for developers
- Add DIAGRAMS.md with system diagrams
- Add SHARED_EXPLAINED.md explaining shared types
- Add FRONTEND_ARCHITECTURE.md for frontend structure
- Add CLEANUP.md noting deprecated files"

Write-Host "✅ All commits completed!"
```

---

## 📊 Conventional Commits Format

Tất cả commits tuân theo format:
```
<type>(<scope>): <subject>

<body>
```

### Types sử dụng:
- `feat`: Tính năng mới
- `refactor`: Refactor code
- `chore`: Cập nhật config, dependencies
- `docs`: Tài liệu

### Scopes:
- `backend`: Backend changes
- `frontend`: Frontend changes
- (no scope): Changes affecting both

---

## ⚠️ Lưu Ý

1. **Thứ tự quan trọng**: Các commits phải theo thứ tự để tránh dependencies lỗi
2. **Test sau mỗi commit**: Đảm bảo code vẫn chạy được
3. **Push theo batch**: Có thể push mỗi 3-4 commits
4. **Review lại**: Xem `git log --oneline` để đảm bảo commits sạch đẹp

---

## 🎯 Kết Quả

Sau khi chạy xong 12 commits:
- ✅ Git history rõ ràng, dễ hiểu
- ✅ Mỗi commit có ý nghĩa riêng
- ✅ Dễ revert nếu cần
- ✅ Dễ review từng phần
- ✅ Tuân theo Conventional Commits standard
