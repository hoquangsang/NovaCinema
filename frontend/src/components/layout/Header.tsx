import { Ticket, Search, UserCircle } from 'lucide-react';
import { Button } from '../common/Button';

export default function Header() {
  return (
    <header className="w-full bg-[#10142C] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4">
        
        <div className="flex h-20 items-center justify-between">

          <a href="/" aria-label="Trang chủ NOVA CINEMA">
            <img src="../public/logo.png" alt="NOVA CINEMA Logo" className="h-20 w-auto" />
          </a>

          <div className="flex items-center gap-4">
            
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-56 rounded-full bg-white py-2 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <Button intent="primary" className="hidden sm:flex">
              <Ticket size={16} />
              <span>BUY TICKETS</span>
            </Button>
            
            <a
              href="/login"
              className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 transition-colors hover:bg-gray-700 hover:text-yellow-400"
            >
              <UserCircle size={24} />
              <span className="hidden font-medium sm:block">Sign In</span>
            </a>
          </div>
        </div>

        <div className="flex h-12 items-center justify-between border-t border-white">
          
          <nav className="flex items-center gap-6">
            <a
              href="/theaters"
              className="font-semibold text-white transition-colors hover:text-yellow-400"
            >
              Showtimes
            </a>
            <a
              href="/showtimes"
              className="font-semibold text-white transition-colors hover:text-yellow-400"
            >
              Now Showing
            </a>
            <a
              href="/showtimes"
              className="font-semibold text-white transition-colors hover:text-yellow-400"
            >
              Coming Soon
            </a>
          </nav>

          <nav className="flex items-center gap-6">
            <a
              href="/discounts"
              className="font-semibold text-white transition-colors hover:text-yellow-400 hover:border-b-2 border-yellow-400"
            >
              Discounts
            </a>
            <a
              href="/about"
              className="font-semibold text-white transition-colors hover:text-yellow-400 hover:border-b-2 border-yellow-400"
            >
              About us
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}