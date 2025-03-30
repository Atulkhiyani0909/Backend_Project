import { Upload, Users, Eye, Calendar } from 'lucide-react';
import { userProfile } from '../data';
import VideoCard from '../components/VideoCard';

export default function ProfilePage() {
  return (
    <div className="dark:bg-gray-900">
      <div className="relative">
        <img
          src={userProfile.banner}
          alt="Channel Banner"
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-col md:flex-row items-start gap-6 -mt-12 relative">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900"
          />
          
          <div className="flex-1 mt-4 md:mt-0">
            <h1 className="text-3xl font-bold dark:text-white">{userProfile.name}</h1>
            
            <div className="flex flex-wrap gap-6 mt-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{userProfile.subscribers} subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{userProfile.totalViews} total views</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Joined {userProfile.joinedDate}</span>
              </div>
            </div>
          </div>

          <button className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">
            <Upload className="w-5 h-5" />
            Upload Video
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Uploaded Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userProfile.uploadedVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}