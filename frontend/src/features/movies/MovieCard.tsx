import { type Movie } from '../../types';
import { Button } from '../../components/common/Button';
import { CirclePlay} from 'lucide-react';
interface Props {
  movie: Movie;
  variant: 'now-showing' | 'coming-soon';
}

export const MovieCard = ({ movie, variant }: Props) => {
  return (
    <div className="bg-transparent rounded-lg overflow-hidden group">
      <div className="relative">
        <img src={movie.poster_url} alt={movie.title} className="w-full aspect-2/3 object-top rounded-bl-lg rounded-br-lg" />
      </div>
      
      <div className="p-4">
        <h3 className=" text-white text-lg wrapper text-center font-bergensans tracking-wide h-10" title={movie.title}>
          {movie.title}
        </h3>

        <div className="flex space-x-2 mt-10 justify-between">
          <Button 
            intent="secondary"
            onClick={() => console.log('Watching trailer...')}
          >
            <div className="flex items-center gap-2">
              <CirclePlay className="w-5 h-5" />
              <span>Watch Trailer</span>
            </div>
          </Button>
          
          {variant === 'now-showing' ? (
            <Button 
              intent="primary"
              className="hidden sm:flex" 
              onClick={() => console.log('Buying ticket...')}
            >
              BUY TICKETS
            </Button>
          ) : (
            <Button 
              intent="primary" 
              className="hidden sm:flex"
            >
              VIEW DETAILS
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};