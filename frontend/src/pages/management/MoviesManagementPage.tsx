import { useState } from 'react';
import MovieHeader from '../../features/management/movie/MovieHeader';
import MovieSearchFilter from '../../features/management/movie/MovieSearchFilter';
import MoviesTable from '../../features/management/movie/MoviesTable';
import AddEditMovieModal from '../../features/management/movie/AddEditMovieModal';
import type { Movie } from '../../api/endpoints/movie.api';

export default function MoviesManagementPage() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleAddClick = () => {
        setSelectedMovie(null);
        setShowModal(true);
    };

    const handleEditClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedMovie(null);
    };

    const handleModalSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    return (
        <div>
            <MovieHeader onAddClick={handleAddClick} />
            
            <MovieSearchFilter 
                search={search} 
                onSearchChange={setSearch} 
            />
            
            <MoviesTable 
                search={search}
                page={page}
                limit={limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
                onEdit={handleEditClick}
                refreshTrigger={refreshTrigger}
            />

            <AddEditMovieModal
                isOpen={showModal}
                onClose={handleModalClose}
                onSuccess={handleModalSuccess}
                movie={selectedMovie}
            />
        </div>
    );
}
