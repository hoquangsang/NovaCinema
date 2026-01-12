// src/features/movies/components/MovieListSlider.tsx
import { type Movie } from '../../api/endpoints/movie.api';
import { MovieCard } from './MovieCard';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Icons
import { ChevronLeft, ChevronRight } from 'lucide-react';
//Import Swiper styles
import './movies.css';

interface Props {
  title: string;
  movies: Movie[];
  variant: 'now-showing' | 'coming-soon';
}

export const MovieListSlider = ({ title, movies, variant }: Props) => {
  const prevClass = `swiper-button-prev-${variant}`;
  const nextClass = `swiper-button-next-${variant}`;

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-white text-center uppercase mb-6 tracking-wide" style={{ fontFamily: 'Anton, sans-serif' }}>
        {title}
      </h2>

      <div className="relative movie-slider-wrapper">

        <button className={`swiper-button-prev-custom ${prevClass}`}>
          <ChevronLeft />
        </button>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          slidesPerGroup={4}
          watchOverflow={true}
          loop={false}
          speed={800}
          navigation={{
            nextEl: `.${nextClass}`,
            prevEl: `.${prevClass}`,
          }}
          pagination={{
            clickable: true,
          }}
          className="pb-4"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie._id} className="movie-slide mb-10">
              <MovieCard movie={movie} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button className={`swiper-button-next-custom ${nextClass}`}>
          <ChevronRight />
        </button>
      </div>

      <div className="text-center mt-6">
        <Link to={variant === 'now-showing' ? '/now-showing' : '/coming-soon'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Button intent="ghost">SEE MORE</Button>
        </Link>
      </div>
    </section>
  );
}