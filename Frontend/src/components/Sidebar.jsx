import { Home, Compass, PlaySquare, Clock, ThumbsUp, Film } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 w-64 h-[calc(100vh-3.5rem)] bg-white dark:bg-gray-900 p-2 overflow-y-auto">
      <nav className="flex flex-col gap-2">
        <Link to="/" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <Home className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link to="/explore" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <Compass className="w-6 h-6" />
          <span>Explore</span>
        </Link>
        <Link to="/subscriptions" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <PlaySquare className="w-6 h-6" />
          <span>Subscriptions</span>
        </Link>
        <hr className="my-2 border-gray-200 dark:border-gray-700" />
        <Link to="/history" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <Clock className="w-6 h-6" />
          <span>History</span>
        </Link>
        <Link to="/liked" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <ThumbsUp className="w-6 h-6" />
          <span>Liked Videos</span>
        </Link>
        <Link to="/shorts" className="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
          <Film className="w-6 h-6" />
          <span>Shorts</span>
        </Link>
      </nav>
    </aside>
  );
}