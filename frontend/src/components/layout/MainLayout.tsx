// src/components/layout/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen mx-auto bg-[#10142C]">
      <Header />
      
      <main className="grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;