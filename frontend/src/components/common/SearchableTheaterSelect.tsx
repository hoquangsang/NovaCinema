import { useState, useEffect, useRef } from "react";
import { Search, X, MapPin, ChevronDown } from "lucide-react";
import type { Theater } from "../../api/endpoints/theater.api";

interface SearchableTheaterSelectProps {
  theaters: Theater[];
  value: string;
  onChange: (theaterId: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableTheaterSelect({
  theaters,
  value,
  onChange,
  placeholder = "Chọn rạp",
  required = false,
}: SearchableTheaterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedTheater = theaters.find((t) => t._id === value);

  // Debounce search with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredTheaters = theaters.filter((theater) =>
    theater.theaterName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    theater.address.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (theaterId: string) => {
    onChange(theaterId);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 
          flex items-center justify-between text-left bg-white ${!selectedTheater ? "text-gray-500" : "text-gray-800"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedTheater ? (
            <div className="truncate">
              <p className="font-medium truncate">{selectedTheater.theaterName}</p>
              <p className="text-xs text-gray-500 truncate">{selectedTheater.address}</p>
            </div>
          ) : (
            <>
              <MapPin size={18} className="text-gray-400" />
              {placeholder}
            </>
          )}
        </span>
        <ChevronDown size={20} className={`transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {required && <input type="hidden" value={value} required />}

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 flex flex-col">
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm rạp..."
                autoFocus
                className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredTheaters.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không tìm thấy rạp
              </div>
            ) : (
              filteredTheaters.map((theater) => (
                <button
                  key={theater._id}
                  type="button"
                  onClick={() => handleSelect(theater._id)}
                  className={`w-full px-3 py-2 flex items-start gap-3 hover:bg-yellow-50 text-left transition-colors
                    ${value === theater._id ? "bg-yellow-100" : ""}`}
                >
                  <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">{theater.theaterName}</p>
                    <p className="text-xs text-gray-500 truncate">{theater.address}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {value && (
            <div className="p-2 border-t bg-gray-50">
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="w-full text-sm text-gray-500 hover:text-red-500 py-1"
              >
                Bỏ chọn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
