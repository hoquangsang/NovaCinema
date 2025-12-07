# Shared Types

Folder này chứa **TypeScript types/interfaces** dùng chung giữa Backend và Frontend.

## 📋 Mục đích

Đảm bảo **type safety** và **consistency** giữa API request/response của Backend và Frontend.

## ✅ Nên có gì trong folder này?

- ✅ TypeScript interfaces
- ✅ TypeScript types
- ✅ TypeScript enums
- ✅ API contract definitions (DTOs)

## ❌ KHÔNG nên có gì?

- ❌ Business logic
- ❌ Implementations (functions, classes với logic)
- ❌ Dependencies từ thư viện bên ngoài
- ❌ Framework-specific code (NestJS decorators, React hooks, etc.)

## 📁 Cấu trúc

```
shared/
└── types/
    ├── movie.types.ts       # Movie DTOs
    ├── booking.types.ts     # Booking DTOs
    ├── showtime.types.ts    # Showtime DTOs
    ├── api.types.ts         # Common API types
    └── index.ts             # Export tất cả
```

## 🔧 Cách sử dụng

### Trong Backend:

```typescript
// backend/src/modules/movies/dtos/index.ts
import { MovieDto, CreateMovieDto } from '@shared/types';

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
import type { MovieDto, CreateMovieDto, PaginatedResponse } from '@shared/types';

export const moviesApi = {
  getMovies: async (): Promise<PaginatedResponse<MovieDto>> => {
    // ...
  },
  
  createMovie: async (data: CreateMovieDto): Promise<MovieDto> => {
    // ...
  }
};
```

## 🔗 Setup TypeScript Path Alias

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

## 🆚 So sánh với Windows/.NET

| Khía cạnh | Web (Node.js + React) | Windows (.NET/C#) |
|-----------|----------------------|-------------------|
| **Shared DTOs** | ✅ Dùng folder `shared/` | ✅ Dùng project `.Shared.dll` |
| **Runtime** | ❌ Khác nhau (Node vs Browser) | ✅ Giống nhau (.NET) |
| **Compile** | ❌ Compile riêng | ✅ Reference trực tiếp |
| **Deploy** | ❌ Deploy riêng | ✅ Deploy cùng nhau |
| **Chia sẻ logic** | ❌ KHÔNG nên | ✅ CÓ thể |

## ⚠️ Lưu ý quan trọng

1. **Chỉ chứa types**, không chứa logic
2. **Không có dependencies** - giữ folder này hoàn toàn độc lập
3. **Sync thủ công** - khi thay đổi types, phải cập nhật cả Backend lẫn Frontend
4. **Tránh circular dependencies** - không import từ backend/frontend vào shared

## 💡 Best Practices

1. **Đặt tên rõ ràng**: `MovieDto`, `CreateMovieDto`, `UpdateMovieDto`
2. **Prefix với Dto**: Để phân biệt với domain models trong backend
3. **Document**: Thêm JSDoc comments cho các types quan trọng
4. **Version control**: Mọi thay đổi trong shared/ phải được review kỹ

## 🚀 Alternative: Generate Types

Nếu dự án lớn, có thể:
1. Định nghĩa types trong Backend (với decorators)
2. Dùng tool để generate types cho Frontend:
   - `typescript-generator` (Java → TS)
   - `swagger-typescript-api` (OpenAPI → TS)
   - `nestjs-swagger` + custom script

Nhưng với dự án vừa/nhỏ, folder `shared/` đơn giản hơn!
