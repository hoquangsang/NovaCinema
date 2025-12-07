# Shared Types

Folder này chứa **TypeScript types/interfaces** dùng chung giữa Backend và Frontend.

## Mục đích

Đảm bảo **type safety** và **consistency** giữa API request/response của Backend và Frontend.

## Nên có gì trong folder này?

- TypeScript interfaces
- TypeScript types
- TypeScript enums
- API contract definitions (DTOs)

## KHÔNG nên có gì?

- Business logic
- Implementations (functions, classes với logic)
- Dependencies từ thư viện bên ngoài
- Framework-specific code (NestJS decorators, React hooks, etc.)

## Cấu trúc

```
shared/
└── types/
    ├── movie.types.ts       # Movie DTOs
    ├── booking.types.ts     # Booking DTOs
    ├── showtime.types.ts    # Showtime DTOs
    ├── api.types.ts         # Common API types
    └── index.ts             # Export tất cả
```

## Cách sử dụng

### Trong Backend:

```typescript
// backend/src/modules/movies/dtos/index.ts
import { MovieDto, CreateMovieDto } from "@shared/types";

export class CreateMovieRequestDto implements CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  // ... thêm decorators cho validation
}
```

### Trong Frontend:

```typescript
// frontend/src/api/endpoints/movies.api.ts
import type {
  MovieDto,
  CreateMovieDto,
  PaginatedResponse,
} from "@shared/types";

export const moviesApi = {
  getMovies: async (): Promise<PaginatedResponse<MovieDto>> => {
    // ...
  },

  createMovie: async (data: CreateMovieDto): Promise<MovieDto> => {
    // ...
  },
};
```

## Setup TypeScript Path Alias

### Backend `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```

### Frontend `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["../shared/*"]
    }
  }
}
```
