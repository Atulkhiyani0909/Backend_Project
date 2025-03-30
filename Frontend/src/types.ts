export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channel: {
    name: string;
    avatar: string;
  };
  views: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  likes: number;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  subscribers: string;
  totalViews: string;
  joinedDate: string;
  uploadedVideos: Video[];
}