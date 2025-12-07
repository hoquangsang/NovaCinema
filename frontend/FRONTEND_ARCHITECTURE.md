# Frontend Architecture Plan

## Current State Issues
- ❌ No centralized API client
- ❌ Mock data mixed with API calls
- ❌ No state management
- ❌ No environment configuration
- ❌ Components accessing API directly

## Proposed Structure

```
frontend/src/
├── api/                    # API Client Layer
│   ├── client.ts          # Axios instance with interceptors
│   ├── endpoints/         # API endpoint definitions
│   │   ├── movies.api.ts
│   │   ├── theaters.api.ts
│   │   ├── showtimes.api.ts
│   │   ├── bookings.api.ts
│   │   └── auth.api.ts
│   └── types/             # API request/response types
│
├── hooks/                  # Custom React Hooks
│   ├── useAuth.ts
│   ├── useMovies.ts
│   ├── useBooking.ts
│   └── ...
│
├── stores/                 # State Management (Zustand/Context)
│   ├── authStore.ts
│   ├── bookingStore.ts
│   └── ...
│
├── services/              # Business Logic Layer
│   ├── bookingService.ts
│   ├── paymentService.ts
│   └── ...
│
├── components/            # UI Components
│   ├── common/           # Reusable components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific components
│
├── pages/                 # Page components
├── types/                 # TypeScript types
├── utils/                 # Utility functions
├── config/                # Configuration
│   └── env.ts
└── constants/             # Constants

## Implementation Steps

1. ✅ Create API client with Axios
2. ✅ Define API endpoints for each module
3. ✅ Create custom hooks for data fetching
4. ✅ Implement state management
5. ✅ Update components to use new structure
6. ✅ Add environment configuration
7. ✅ Add error handling and loading states
8. ✅ Add authentication flow

## Technology Stack
- React Query (for server state)
- Axios (HTTP client)
- Zustand (client state)
- TypeScript (type safety)
