export const videos = [
  {
    id: '1',
    title: 'Building a Modern Web Application',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    channel: {
      name: 'TechChannel',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    },
    views: '120K',
    timestamp: '2 days ago'
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
    channel: {
      name: 'ReactMaster',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36'
    },
    views: '89K',
    timestamp: '5 days ago'
  }
];

export const comments = [
  {
    id: '1',
    user: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    },
    text: 'Great tutorial! Really helped me understand the concepts better.',
    likes: 42,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    user: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
    },
    text: 'Thanks for sharing this knowledge. Looking forward to more content!',
    likes: 28,
    timestamp: '5 hours ago'
  }
];

export const userProfile = {
  id: '1',
  name: 'TechChannel',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  banner: 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74',
  subscribers: '1.2M',
  totalViews: '10M',
  joinedDate: 'Jan 15, 2020',
  uploadedVideos: videos
};