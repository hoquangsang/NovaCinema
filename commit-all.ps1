# NovaCinema Refactoring - Git Commit Script
# Run this script to commit all changes in logical groups

Write-Host "🚀 Starting commit process..." -ForegroundColor Green
Write-Host ""

# Commit 1: Domain Layer
Write-Host "📦 Commit 1/12: Domain Layer" -ForegroundColor Cyan
git add backend/src/domain/
git commit -m "feat(backend): add domain layer with business models

- Add 7 domain models: Movie, Theater, Room, Seat, User, Showtime, Booking
- Add domain interfaces for repositories and services
- Implement business methods in models (isBookable, canBeCancelled, etc.)
- Framework-independent pure business logic"

# Commit 2: Infrastructure Layer
Write-Host "📦 Commit 2/12: Infrastructure Layer" -ForegroundColor Cyan
git add backend/src/infrastructure/
git commit -m "feat(backend): add infrastructure layer with data mappers

- Add data mappers for Movie, Showtime, Booking
- Implement toDomain() and toPersistence() methods
- Separate domain models from database documents"

# Commit 3: Application Layer
Write-Host "📦 Commit 3/12: Application Layer" -ForegroundColor Cyan
git add backend/src/application/
git commit -m "feat(backend): add application layer with use cases

- Add CreateBookingUseCase with seat validation and price calculation
- Add ConfirmBookingUseCase for payment processing
- Add CancelBookingUseCase with refund logic
- Implement complex business workflows"

# Commit 4: Repository Enhancements
Write-Host "📦 Commit 4/12: Repository Enhancements" -ForegroundColor Cyan
git add backend/src/modules/shared/repositories/base.repository.ts
git add backend/src/modules/theaters/repositories/seat.repository.ts
git commit -m "refactor(backend): enhance base repository and seat repository

- Change BaseRepository methods from protected to public
- Add findByIds() method to BaseRepository
- Add bulkUpdateStatus() to SeatRepository for reservations
- Add findAvailableSeats() to SeatRepository"

# Commit 5: Showtimes Module
Write-Host "📦 Commit 5/12: Showtimes Module" -ForegroundColor Cyan
git add backend/src/modules/showtimes/
git commit -m "feat(backend): add showtimes module

- Add ShowtimeController with CRUD endpoints
- Add ShowtimeService with business logic
- Add ShowtimeRepository with specialized queries
- Add Showtime schema with indexes
- Add ShowtimeDto for API responses
- Implement findBookableShowtimes functionality"

# Commit 6: Bookings Module
Write-Host "📦 Commit 6/12: Bookings Module" -ForegroundColor Cyan
git add backend/src/modules/bookings/
git commit -m "feat(backend): add bookings module

- Add BookingsController with create, confirm, cancel endpoints
- Add BookingService integrating use cases
- Add BookingRepository with booking code generation
- Add Booking schema with compound indexes
- Add BookingDto and CreateBookingDto
- Implement 15-minute expiration logic"

# Commit 7: Backend Configuration
Write-Host "📦 Commit 7/12: Backend Configuration" -ForegroundColor Cyan
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
Write-Host "📦 Commit 8/12: Frontend API Client" -ForegroundColor Cyan
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
Write-Host "📦 Commit 9/12: Frontend Migration" -ForegroundColor Cyan
git add frontend/src/pages/MovieDetailPage.tsx
git add frontend/src/features/movies/NowShowing.tsx
git add frontend/src/features/movies/ComingSoon.tsx
git commit -m "refactor(frontend): migrate to new API client

- Update MovieDetailPage to use moviesApi
- Update NowShowing to use moviesApi.getShowingMovies()
- Update ComingSoon to use moviesApi.getUpcomingMovies()
- Remove deprecated imports"

# Commit 10: Remove Deprecated
Write-Host "📦 Commit 10/12: Remove Deprecated Files" -ForegroundColor Cyan
git add frontend/src/api/
git commit -m "chore(frontend): remove deprecated API files

- Remove MockData.ts (replaced by backend API)
- Remove MovieAPI.ts (replaced by new API client)"

# Commit 11: Shared Types
Write-Host "📦 Commit 11/12: Shared Types Package" -ForegroundColor Cyan
git add shared/
git commit -m "feat: add shared types package

- Add shared TypeScript types for Movie, Booking, Showtime
- Add common API response types
- Add package.json and tsconfig.json for shared package
- Add comprehensive README for usage guidelines"

# Commit 12: Documentation
Write-Host "📦 Commit 12/12: Documentation" -ForegroundColor Cyan
git add ARCHITECTURE.md ARCHITECTURE_VI.md REFACTORING_SUMMARY.md REFACTORING_SUMMARY_VI.md QUICK_START.md QUICK_START_VI.md DIAGRAMS.md DIAGRAMS_VI.md CLEANUP.md SHARED_EXPLAINED.md COMMIT_STRATEGY.md frontend/FRONTEND_ARCHITECTURE.md
git commit -m "docs: add comprehensive architecture documentation

- Add ARCHITECTURE.md explaining 3-tier architecture
- Add Vietnamese translations for all documentation
- Add REFACTORING_SUMMARY.md with changes overview
- Add QUICK_START.md for developers
- Add DIAGRAMS.md with system diagrams
- Add SHARED_EXPLAINED.md explaining shared types
- Add FRONTEND_ARCHITECTURE.md for frontend structure
- Add CLEANUP.md noting deprecated files
- Add COMMIT_STRATEGY.md for commit guidelines"

Write-Host ""
Write-Host "✅ All 12 commits completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Review commits:" -ForegroundColor Yellow
git log --oneline -12
Write-Host ""
Write-Host "🚀 Ready to push! Run: git push origin develop" -ForegroundColor Green
