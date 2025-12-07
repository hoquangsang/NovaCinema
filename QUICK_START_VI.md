# 🚀 Hướng Dẫn Khởi Động Nhanh - NovaCinema

## Yêu Cầu

- Node.js 18+ đã cài đặt
- MongoDB 6+ đang chạy (local hoặc MongoDB Atlas)
- Git

---

## 📥 Bước 1: Cài Đặt Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install axios
```

---

## ⚙️ Bước 2: Cấu Hình Environment

### Cấu Hình Backend

1. Copy file environment mẫu:
```bash
cd backend
cp .env.example .env
```

2. Chỉnh sửa `.env`:
```env
# Database - Dùng MongoDB Atlas hoặc local
DATABASE_URL=mongodb://localhost:27017/novacinema
# Hoặc MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/novacinema

# JWT Secrets (HÃY THAY ĐỔI!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Email (cho xác thực OTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Cấu Hình Frontend

1. Copy file environment mẫu:
```bash
cd frontend
cp .env.example .env.local
```

2. Chỉnh sửa `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🗄️ Bước 3: Thiết Lập Database (Tùy chọn)

Nếu có seeders:
```bash
cd backend
npm run seed
```

---

## 🏃 Bước 4: Chạy Ứng Dụng

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

Backend sẽ chạy tại: `http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 📖 Bước 5: Truy Cập Tài Liệu API

Mở Swagger UI trong trình duyệt:
```
http://localhost:3000/api/docs
```

Tại đây bạn có thể:
- Xem tất cả API endpoints
- Test endpoints trực tiếp
- Xem request/response schemas
- Hiểu authentication flow

---

## 🧪 Bước 6: Test API

### Cách 1: Dùng Swagger UI
1. Truy cập `http://localhost:3000/api/docs`
2. Click vào bất kỳ endpoint nào
3. Click "Try it out"
4. Điền parameters
5. Click "Execute"

### Cách 2: Dùng Frontend
1. Mở `http://localhost:5173`
2. Browse phim
3. Chọn lịch chiếu
4. Đặt vé (cần đăng nhập)

### Cách 3: Dùng cURL hoặc Postman

**Lấy Phim Đang Chiếu:**
```bash
curl http://localhost:3000/api/movies/showing
```

**Đăng Ký User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phoneNumber": "0123456789",
    "dateOfBirth": "1990-01-01"
  }'
```

**Đăng Nhập:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 🔍 Hiểu Kiến Trúc Mới

### Các Folder Chính:

1. **`backend/src/domain/`** - Logic nghiệp vụ thuần túy (MỚI)
   - Domain models với các phương thức nghiệp vụ
   - Độc lập với framework

2. **`backend/src/application/`** - Use cases (MỚI)
   - Các nghiệp vụ phức tạp
   - Điều phối transactions

3. **`backend/src/modules/showtimes/`** - Module lịch chiếu (MỚI)
   - Quản lý lịch chiếu phim

4. **`backend/src/modules/bookings/`** - Module đặt vé (MỚI)
   - Xử lý đặt vé

5. **`frontend/src/api/`** - API client layer (MỚI)
   - API calls type-safe
   - Tự động refresh token

---

## 📝 Các Tác Vụ Thường Dùng

### Tạo Phim Mới (Admin)

1. Đăng nhập với quyền admin
2. Sử dụng access token
3. POST tới `/api/movies`:

```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "genre": ["Sci-Fi", "Thriller"],
    "duration": 148,
    "description": "Một bộ phim giật gân đan xen",
    "posterUrl": "https://example.com/poster.jpg",
    "trailerUrl": "https://example.com/trailer.mp4",
    "releaseDate": "2025-12-15",
    "endDate": "2026-01-15",
    "ratingAge": 13,
    "country": "USA",
    "language": "English",
    "actors": ["Leonardo DiCaprio"],
    "director": "Christopher Nolan",
    "producer": "Emma Thomas"
  }'
```

### Tạo Lịch Chiếu (Admin)

```bash
curl -X POST http://localhost:3000/api/showtimes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "MOVIE_ID",
    "roomId": "ROOM_ID",
    "theaterId": "THEATER_ID",
    "startTime": "2025-12-15T14:30:00Z",
    "duration": 148,
    "basePrice": 100000
  }'
```

### Đặt Vé (User đã đăng nhập)

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "showtimeId": "SHOWTIME_ID",
    "seatIds": ["SEAT_ID_1", "SEAT_ID_2"]
  }'
```

---

## 🐛 Xử Lý Sự Cố

### Backend Không Khởi Động

**Lỗi**: `Cannot connect to MongoDB`
- ✅ Đảm bảo MongoDB đang chạy
- ✅ Kiểm tra `DATABASE_URL` trong `.env`
- ✅ Test kết nối: `mongosh mongodb://localhost:27017`

**Lỗi**: `Port 3000 already in use`
- ✅ Đổi `PORT` trong `.env`
- ✅ Hoặc kill process đang dùng port 3000

### Frontend Không Kết Nối Backend

- ✅ Kiểm tra backend đang chạy tại `http://localhost:3000`
- ✅ Xác minh `VITE_API_BASE_URL` trong `.env.local`
- ✅ Kiểm tra console trình duyệt có lỗi CORS không
- ✅ Xác minh `CORS_ORIGIN` trong backend `.env`

### Lỗi TypeScript

- ✅ Chạy `npm install` ở cả backend và frontend
- ✅ Restart VS Code
- ✅ Kiểm tra `tsconfig.json` đã config path aliases chưa

---

## 📚 Các Bước Tiếp Theo

1. **Đọc Tài Liệu Kiến Trúc**:
   - `ARCHITECTURE_VI.md` - Giải thích chi tiết kiến trúc
   - `REFACTORING_SUMMARY_VI.md` - Tổng hợp những gì đã thay đổi

2. **Khám Phá Code**:
   - Bắt đầu với domain models trong `backend/src/domain/models/`
   - Xem use cases trong `backend/src/application/use-cases/`
   - Review API endpoints trong Swagger

3. **Thêm Tính Năng**:
   - Tuân theo các patterns đã thiết lập
   - Tạo domain models trước
   - Implement use cases cho logic phức tạp
   - Thêm API endpoints cuối cùng

4. **Viết Tests**:
   - Unit tests cho use cases
   - Integration tests cho repositories
   - E2E tests cho các flows quan trọng

---

## 🎯 Các Endpoints Chính Cần Thử

### Public (Không cần đăng nhập):
- `GET /api/movies/showing` - Lấy phim đang chiếu
- `GET /api/movies/upcoming` - Lấy phim sắp chiếu
- `GET /api/movies/:id` - Chi tiết phim
- `GET /api/showtimes?movieId=X` - Lịch chiếu của phim

### Authenticated (Cần đăng nhập):
- `POST /api/bookings` - Tạo booking
- `GET /api/bookings/my-bookings` - Xem bookings của bạn
- `DELETE /api/bookings/:id` - Hủy booking

### Admin Only:
- `POST /api/movies` - Tạo phim
- `POST /api/showtimes` - Tạo lịch chiếu
- `PATCH /api/showtimes/:id/status` - Cập nhật trạng thái lịch chiếu

---

## 📖 Tìm Hiểu Thêm

- **NestJS**: https://docs.nestjs.com
- **MongoDB**: https://docs.mongodb.com
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

## ✅ Dấu Hiệu Thành Công

Bạn biết mọi thứ đang hoạt động khi:

- ✅ Backend khởi động không lỗi
- ✅ Frontend kết nối được backend
- ✅ Swagger UI truy cập được
- ✅ Bạn xem được phim trên frontend
- ✅ Bạn đăng ký và đăng nhập được
- ✅ Bạn tạo và xem bookings được

---

## 🆘 Nhận Trợ Giúp

Nếu gặp vấn đề:

1. Kiểm tra hướng dẫn này trước
2. Đọc kỹ error messages
3. Kiểm tra logs backend trong terminal
4. Kiểm tra console frontend trong browser
5. Review cấu hình `.env`
6. Đảm bảo tất cả dependencies đã cài
7. Restart cả backend và frontend

---

## 🎉 Bạn Đã Sẵn Sàng!

Ứng dụng NovaCinema của bạn giờ đã có:
- ✅ Kiến trúc 3 tầng chuẩn thế giới
- ✅ Phân tách trách nhiệm rõ ràng
- ✅ APIs type-safe
- ✅ Tài liệu đầy đủ
- ✅ Cấu trúc dễ mở rộng

Chúc bạn code vui vẻ! 🚀
