import { useQuery } from "@tanstack/react-query";
import { movieApi } from "../api/endpoints/movie.api";
import { MovieCard } from "../features/movies/MovieCard";


export default function NowShowingPage() {
    const { data: movies, isLoading } = useQuery({
        queryKey: ['movies'],
        queryFn: () => movieApi.getNowShowing(),
    });
    if (isLoading) {
        return <div className="text-white text-center py-20">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#0A0E27] py-16">
            <div className="container mx-auto max-w-7xl px-4">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-white uppercase tracking-wide mb-4"
                        style={{ fontFamily: 'Anton, sans-serif' }}>
                        Now Showing
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover all movies currently playing in theaters
                    </p>
                </div>
                {/* Movies Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies?.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} variant="now-showing" />
                    ))}
                </div>
                {/* Empty State */}
                {movies?.length === 0 && (
                    <div className="text-center text-gray-400 py-20">
                        <p className="text-xl">No movies currently showing</p>
                    </div>
                )}
            </div>
        </div>
    )
}