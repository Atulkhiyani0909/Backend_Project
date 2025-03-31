import { Link } from 'react-router-dom';

export default function VideoCard({ video, className = '' }) {
  console.log("this is inside the video Card", video)
  return (
    <Link to={`/video/${video._id}`} className={`block ${className}`}>
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover rounded-lg"
        />
      </div>
      <div className="flex gap-3 mt-3">
        {/* <img
          src={video.channel.avatar}
          alt={video.channel.name}
          className="w-9 h-9 rounded-full"
        /> */}
        <div>
          <h3 className="font-medium line-clamp-2 dark:text-white">{video.title}</h3>
          {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{video.channel.name}</p> */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {video.views} views • {Math.floor(video.duration)} Seconds
          </p>
        </div>
      </div>
    </Link>
  );
}