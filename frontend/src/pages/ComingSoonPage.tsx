import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api/endpoints/movie.api";
import { MovieCard } from "../features/movies/MovieCard";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ComingSoonPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 12;

    const { data: response, isLoading } = useQuery({
        queryKey: ['movies', 'coming-soon', currentPage],
        queryFn: () => movieApi.getComingSoon(currentPage, moviesPerPage),
    });

    if (isLoading) {
        return <div className="text-white text-center py-20">Loading...</div>
    }

    const movies = response?.items || [];
    const totalPages = response?.totalPages || 0;
    const total = response?.total || 0;

    // Debug logging
    console.log('API Response:', response);
    console.log('Movies:', movies);
    console.log('Total Pages:', totalPages);

    // Hàm chuyển trang
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //array các số trang để hiển thị
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) pages.push(i);
            } else if (currentPage >= totalPages - 2) {
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
            }
        }
        return pages;
    };

    return (
        <div className="min-h-screen bg-[#0A0E27] py-16">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-white uppercase tracking-wide mb-4"
                        style={{ fontFamily: 'Anton, sans-serif' }}>
                        Coming Soon
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover all movies that will be playing in theaters
                    </p>
                    {response && (
                        <p className="text-gray-500 text-sm mt-2">
                            Showing {movies.length} of {total} movies (Page {currentPage} of {totalPages})
                        </p>
                    )}
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} />
                    ))}
                </div>

                {/* Empty State */}
                {movies.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        <p className="text-xl">No movies coming soon</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === 1
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-yellow-400 hover:text-[#10142C]'
                                }`}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        {/* Page Numbers */}
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === pageNum
                                    ? 'bg-yellow-400 text-[#10142C]'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center gap-1 px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === totalPages
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-800 text-white hover:bg-yellow-400 hover:text-[#10142C]'
                                }`}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}