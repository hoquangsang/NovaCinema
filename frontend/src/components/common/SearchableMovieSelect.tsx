import { useState, useEffect, useRef } from "react";
import { Search, X, Film, ChevronDown } from "lucide-react";
import type { Movie } from "../../api/endpoints/movie.api";

interface SearchableMovieSelectProps {
  movies: Movie[];
  value: string;
  onChange: (movieId: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function SearchableMovieSelect({
  movies,
  value,
  onChange,
  placeholder = "Chọn phim",
  required = false,
}: SearchableMovieSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedMovie = movies.find((m) => m._id === value);

  // Debounce search with 500ms delay
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (movieId: string) => {
    onChange(movieId);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 
          flex items-center justify-between text-left bg-white ${!selectedMovie ? "text-gray-500" : "text-gray-800"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedMovie ? (
            <>
              {selectedMovie.posterUrl && (
                <img
                  src={selectedMovie.posterUrl}
                  alt=""
                  className="w-8 h-12 object-cover rounded"
                />
              )}
              <div className="truncate">
                <p className="font-medium truncate">{selectedMovie.title}</p>
                <p className="text-xs text-gray-500">{selectedMovie.duration} phút</p>
              </div>
            </>
          ) : (
            <>
              <Film size={20} className="text-gray-400" />
              {placeholder}
            </>
          )}
        </span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Hidden input for form validation */}
      {required && <input type="hidden" value={value} required />}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm phim..."
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

          {/* Movie List */}
          <div className="overflow-y-auto flex-1">
            {filteredMovies.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không tìm thấy phim
              </div>
            ) : (
              filteredMovies.map((movie) => (
                <button
                  key={movie._id}
                  type="button"
                  onClick={() => handleSelect(movie._id)}
                  className={`w-full px-3 py-2 flex items-center gap-3 hover:bg-yellow-50 text-left transition-colors
                    ${value === movie._id ? "bg-yellow-100" : ""}`}
                >
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt=""
                      className="w-10 h-14 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      <Film size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">{movie.title}</p>
                    <p className="text-xs text-gray-500">
                      {movie.duration} phút • {movie.genres?.slice(0, 2).join(", ")}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Clear Selection */}
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
