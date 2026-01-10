// src/pages/HomePage.tsx
import { NowShowing } from '../features/movies/NowShowing';
import { ComingSoon } from '../features/movies/ComingSoon';

const HomePage = () => {
  return (
    <div className="py-16 space-y-20">
      <NowShowing />
      <ComingSoon />
    </div>
  );
};

export default HomePage;