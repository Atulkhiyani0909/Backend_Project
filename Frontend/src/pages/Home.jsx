import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import axios from "axios";


export default function Home() {
  const [videos,setVideos]=useState([]);
 useEffect(()=>{
  async function fetchData(){
    let data =await axios.get("http://localhost:8080/api/v1/videos/get-all-videos");
    setVideos(data.data.data.docs);
  }
  fetchData();
 },[])

 console.log("This is the Data ",videos)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 dark:bg-gray-900">
      {videos.map(video => (
        console.log(video.thumbnail),
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}