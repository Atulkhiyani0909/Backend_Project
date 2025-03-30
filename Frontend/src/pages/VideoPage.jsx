import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share, MessageCircle } from 'lucide-react';
import { videos, comments } from '../data';
import VideoCard from '../components/VideoCard';

export default function VideoPage() {
  const { id } = useParams();
  const video = videos.find(v => v.id === id);
  const relatedVideos = videos.filter(v => v.id !== id);

  if (!video) return <div>Video not found</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 dark:bg-gray-900">
      <div className="flex-1">
        <div className="aspect-video">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        
        <h1 className="text-xl font-bold mt-4 dark:text-white">{video.title}</h1>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <img
              src={video.channel.avatar}
              alt={video.channel.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium dark:text-white">{video.channel.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">1.2M subscribers</p>
            </div>
            <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full">
              Subscribe
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full dark:text-white">
              <ThumbsUp className="w-5 h-5" />
              <span>123K</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full dark:text-white">
              <ThumbsDown className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full dark:text-white">
              <Share className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">
            {comments.length} Comments
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt="Your avatar"
              className="w-10 h-10 rounded-full"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-gray-600 outline-none py-1"
            />
          </div>
          
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-4 mb-4">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium dark:text-white">{comment.user.name}</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{comment.timestamp}</span>
                </div>
                <p className="mt-1 dark:text-gray-300">{comment.text}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 dark:text-gray-400">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="dark:text-gray-400">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="text-sm font-medium dark:text-gray-400">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lg:w-96">
        <h2 className="font-bold mb-4 dark:text-white">Related Videos</h2>
        <div className="flex flex-col gap-4">
          {relatedVideos.map(video => (
            <VideoCard
              key={video.id}
              video={video}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}