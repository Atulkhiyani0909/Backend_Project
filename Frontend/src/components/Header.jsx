import { Search, Bell, Video, User, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-between px-4 h-14 shadow-sm">
      <div className="flex items-center gap-4">
        <img src="/youtube-logo.png" alt="YouTube" className="h-5 dark:invert" />
      </div>
      
      <div className="flex-1 max-w-2xl mx-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-l-full focus:outline-none focus:border-blue-500"
          />
          <button className="px-6 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-full hover:bg-gray-200 dark:hover:bg-gray-600">
            <Search className="w-5 h-5 dark:text-white" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 dark:text-white" />
          ) : (
            <Sun className="w-5 h-5 text-white" />
          )}
        </button>
        <Video className="w-6 h-6 dark:text-white" />
        <Bell className="w-6 h-6 dark:text-white" />
        
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <User className="w-full h-full" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium dark:text-white">TechChannel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">1.2M subscribers</p>
                </div>
              </Link>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                View your channel
              </Link>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}