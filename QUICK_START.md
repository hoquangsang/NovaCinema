# 🚀 Quick Start Guide - NovaCinema Refactored

## Prerequisites

- Node.js 18+ installed
- MongoDB 6+ running (locally or MongoDB Atlas)
- Git

---

## 📥 Step 1: Install Dependencies

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

## ⚙️ Step 2: Configure Environment

### Backend Configuration

1. Copy environment example:
```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your settings:
```env
# Database - Use MongoDB Atlas or local
DATABASE_URL=mongodb://localhost:27017/novacinema
# Or MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/novacinema

# JWT Secrets (CHANGE THESE!)
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Email (for OTP verification)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### Frontend Configuration

1. Copy environment example:
```bash
cd frontend
cp .env.example .env.local
```

2. Edit `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 🗄️ Step 3: Setup Database (Optional)

If you have seeders:
```bash
cd backend
npm run seed
```

---

## 🏃 Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
npm run start:dev
```

Backend will run at: `http://localhost:3000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 📖 Step 5: Access Documentation

Open Swagger UI in browser:
```
http://localhost:3000/api/docs
```

Here you can:
- View all API endpoints
- Test endpoints directly
- See request/response schemas
- Understand authentication flow

---

## 🧪 Step 6: Test the API

### Option 1: Using Swagger UI
1. Go to `http://localhost:3000/api/docs`
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters
5. Click "Execute"

### Option 2: Using the Frontend
1. Open `http://localhost:5173`
2. Browse movies
3. Select showtimes
4. Make bookings (requires authentication)

### Option 3: Using cURL or Postman

**Get Showing Movies:**
```bash
curl http://localhost:3000/api/movies/showing
```

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phoneNumber": "1234567890",
    "dateOfBirth": "1990-01-01"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

## 🔍 Understanding the New Architecture

### Key Folders:

1. **`backend/src/domain/`** - Pure business logic (NEW)
   - Domain models with business methods
   - Framework-independent

2. **`backend/src/application/`** - Use cases (NEW)
   - Complex business operations
   - Transaction orchestration

3. **`backend/src/modules/showtimes/`** - Showtimes module (NEW)
   - Movie screening schedules

4. **`backend/src/modules/bookings/`** - Bookings module (NEW)
   - Ticket reservations

5. **`frontend/src/api/`** - API client layer (NEW)
   - Type-safe API calls
   - Automatic token refresh

---

## 📝 Common Tasks

### Create a New Movie (Admin)

1. Login as admin
2. Use the access token
3. POST to `/api/movies`:

```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Inception",
    "genre": ["Sci-Fi", "Thriller"],
    "duration": 148,
    "description": "A mind-bending thriller",
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

### Create a Showtime (Admin)

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

### Make a Booking (Authenticated User)

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

## 🐛 Troubleshooting

### Backend Won't Start

**Error**: `Cannot connect to MongoDB`
- ✅ Make sure MongoDB is running
- ✅ Check `DATABASE_URL` in `.env`
- ✅ Test connection: `mongosh mongodb://localhost:27017`

**Error**: `Port 3000 already in use`
- ✅ Change `PORT` in `.env`
- ✅ Or kill the process using port 3000

### Frontend Can't Connect to Backend

- ✅ Check backend is running at `http://localhost:3000`
- ✅ Verify `VITE_API_BASE_URL` in `.env.local`
- ✅ Check browser console for CORS errors
- ✅ Verify `CORS_ORIGIN` in backend `.env`

### TypeScript Errors

- ✅ Run `npm install` in both backend and frontend
- ✅ Restart VS Code
- ✅ Check `tsconfig.json` has path aliases configured

---

## 📚 Next Steps

1. **Read Architecture Docs**:
   - `ARCHITECTURE.md` - Detailed architecture explanation
   - `REFACTORING_SUMMARY.md` - What was changed

2. **Explore the Code**:
   - Start with domain models in `backend/src/domain/models/`
   - Look at use cases in `backend/src/application/use-cases/`
   - Review API endpoints in Swagger

3. **Add Features**:
   - Follow the patterns established
   - Create domain models first
   - Implement use cases for complex logic
   - Add API endpoints last

4. **Write Tests**:
   - Unit tests for use cases
   - Integration tests for repositories
   - E2E tests for critical flows

---

## 🎯 Key Endpoints to Try

### Public (No Auth Required):
- `GET /api/movies/showing` - Get movies currently showing
- `GET /api/movies/upcoming` - Get upcoming movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/showtimes?movieId=X` - Get showtimes for a movie

### Authenticated (Requires Login):
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/my-bookings` - View your bookings
- `DELETE /api/bookings/:id` - Cancel a booking

### Admin Only:
- `POST /api/movies` - Create movie
- `POST /api/showtimes` - Create showtime
- `PATCH /api/showtimes/:id/status` - Update showtime status

---

## 📖 Learn More

- **NestJS**: https://docs.nestjs.com
- **MongoDB**: https://docs.mongodb.com
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

---

## ✅ Success Indicators

You know everything is working when:

- ✅ Backend starts without errors
- ✅ Frontend connects to backend
- ✅ Swagger UI is accessible
- ✅ You can view movies on the frontend
- ✅ You can register and login
- ✅ You can create and view bookings

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide first
2. Review error messages carefully
3. Check backend logs in terminal
4. Check frontend console in browser
5. Review `.env` configuration
6. Ensure all dependencies are installed
7. Restart both backend and frontend

---

## 🎉 You're Ready!

Your NovaCinema application now has:
- ✅ World-class 3-tier architecture
- ✅ Proper separation of concerns
- ✅ Type-safe APIs
- ✅ Comprehensive documentation
- ✅ Scalable structure

Happy coding! 🚀
