// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import MovieDetailPage from "./pages/MovieDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route cha "/" sẽ dùng MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Khi truy cập "/", route con `index` sẽ được render */}
          {/* Đây chính là HomePage, nó sẽ chui vào <Outlet /> của MainLayout */}
          <Route index element={<HomePage />} />

          {/* Thêm các trang khác ở đây sau này, ví dụ: */}
          {/* <Route path="login" element={<div>Login Page</div>} /> */}
          {/* <Route path="movie/:id" element={<div>Movie Detail Page</div>} /> */}
          {/* Movie detail */}
          <Route path="movie/:id" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
