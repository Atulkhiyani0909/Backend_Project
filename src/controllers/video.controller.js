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
  
    const checkVideo=await Video.findById(videoId);
    if(!checkVideo){
        return res.status(400).json(
            new APIResponse(400,{},"Video Not Avaliable")
        )
    }

    const videoOwner = await Video.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(videoId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "Owner",     // project is written inside the lookup so it can bring the required field only
            pipeline: [
              {
                $project: {
                  _id:1,
                  Name: 1,
                  username: 1,
                  email: 1
                }
              }
            ]
          }
        },
        {
          $unwind: {
            path: "$Owner",
            preserveNullAndEmptyArrays: true
          }
        }
      ]);
      
    
    if(!((req.user._id).toString() === (videoOwner[0].Owner._id).toString())){
        console.log("You Can't Edit this Video not Owner");
        return res.status(403).json(
            new APIResponse(403,{},"Not an Owner")
        );
    }
    
    //TODO: update video details like title, description, thumbnail

   const thumbnailLocalPath=req.file?.path || checkVideo.thumbnail;
   
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