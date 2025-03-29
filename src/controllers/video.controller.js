import {mongoose} from 'mongoose'
import {Video} from '../models/video.model.js'
import {uploadToCloudinary} from "../utils/cloudinary.js"
import {APIError} from "../utils/ApiError.js"
import {APIResponse} from "../utils/ApiResponse.js"
import {asyncHandler1} from "../utils/asyncHandler.js"


const publishAVideo = asyncHandler1(async (req, res) => {
    
    const { title, description} = req.body
    console.log(title , description);
    
    
    // TODO: get video, upload to cloudinary, create video
    let videoFileLocalPath=req.files?.video[0]?.path;
    

    let thumbnailLocalPath=req.files?.thumbnail[0]?.path;
    
    
    const VideoTOCloud=await uploadToCloudinary(videoFileLocalPath);
     console.log("This is video" ,VideoTOCloud);

    const thumbnailTOCloud=await uploadToCloudinary(thumbnailLocalPath);
     console.log("This is the thummbnail" ,thumbnailTOCloud);
    
    
    if(!VideoTOCloud){
        throw new APIError(400,"Failed To Upload the Video to Cloud");
     }

    if(!thumbnailTOCloud){
        throw new APIError(400,"Failed To UPload the Thumbnail to Cloud");
    }

    let newVideo=await Video.create({
        videoFile:VideoTOCloud?.secure_url,
        thumbnail:thumbnailTOCloud?.secure_url,
        duration:VideoTOCloud.duration,
        title:title,
        description:description,
        owner:req.user._id
    })
    
    if(!newVideo){
        throw new APIError(400, "Failed to Upload the Video");
    }

    return res.status(201).json(
        new APIResponse(200,newVideo,"Video Uploaded Successfully")
    )
})


const getVideoById = asyncHandler1(async (req, res) => {
    const { videoId } = req.params;
    
    let videoInfo=await Video.findById(videoId).select("-isPublished");
    
   //TODO: get video by id
    if(!videoInfo){
        throw new APIError(400,"Video Requested Doesn't Exists");
    }

    return res.status(201).json(
        new APIResponse(200,videoInfo,"Video Found SuccessFully")
    )
    
})

const updateVideo = asyncHandler1(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body
    console.log(title , description);
    
    
    
    //TODO: update video details like title, description, thumbnail

    if(!req.file){
      throw new APIError(400, "Thumbnail Missing");
    }

   const thumbnailLocalPath=req.file?.path;
   
    const thumbnailTOCloud=await uploadToCloudinary(thumbnailLocalPath);
    
    let videoInfo=await Video.findByIdAndUpdate(videoId ,{
        $set:{
            title:title,
            description:description,
            thumbnail:thumbnailTOCloud?.secure_url
        }
    },{new:true})
    
    if(!videoInfo){
        throw new APIError(400, "Failed TO Update");
    }

    return res.status(201).json(
        new APIResponse(200,videoInfo,"Video Updated Successfully")
    )

})

const deleteVideo = asyncHandler1(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler1(async (req, res) => {
    const { videoId } = req.params
})


export {publishAVideo,getVideoById,updateVideo}