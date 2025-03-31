import {mongoose} from 'mongoose'
import {Video} from '../models/video.model.js'
import {uploadToCloudinary} from "../utils/cloudinary.js"
import {APIError} from "../utils/ApiError.js"
import {APIResponse} from "../utils/ApiResponse.js"
import {asyncHandler1} from "../utils/asyncHandler.js"
import {OwnerCheck} from "../utils/videoOwner.js"
import aggregatePaginate  from "mongoose-aggregate-paginate-v2";




//this is the one of the Most Critical Part of this Controllers
const getAllVideos = asyncHandler1(async (req, res) => {
    const { page , limit } = req.query
    //TODO: get all videos based on query, sort, pagination

    const video= [ //don't use await with this as it will resolve and give 
        {
            $match:{
                isPublished:true
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                title:1,
                description:1,
                thumbnail:1,
                duration:1,
                views:1,
                videoFile:1
            }
        }
    ]

    const options={//options need to be pass while pagination page to show and limit
        page,
        limit
    }
    
    //pass the Video.aggrate(video) it inside aggreatepaginate only otherwise it already executed //pass the piplines here with the option
    const result =await Video.aggregatePaginate(Video.aggregate(video),options);//this is use to do pagination
    console.log(result);
    

    res.status(200).json(
        new APIResponse(200,result,"Done")
    )
})




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

    const videoInfo=await Video.findById(videoId);

    if(!videoInfo){
        throw new APIError(400,"Video Requested Doesn't Exists");
    }

    const video = await Video.aggregate([
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
                as: "Owner",
                pipeline: [//as now I am inside the Owner details start from there 
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "channel",
                            as: "Subscribers",
                        }
                    },
                    {
                        $addFields: {
                            subscriberCount: { $size: "$Subscribers" }
                        }
                    },
                    {
                        $project: {
                            _id: 1, // Include if needed
                            username: 1,
                            email: 1,
                            avatar: 1,
                            subscriberCount: 1 // Now included
                        }
                    }
                ]
            }
        },
        {
            $unwind: {
                path: "$Owner",// as all info is inside this open it and take its value
                preserveNullAndEmptyArrays: true
            }
        }
    ]);
    
    
   //TODO: get video by id
   

    return res.status(201).json(
        new APIResponse(200,video,"Video Found SuccessFully")
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

    
    //TODO: update video details like title, description, thumbnail
     await OwnerCheck(videoId , req);

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
    const video=await Video.findById(videoId);

    if(!video){
        return res.status(400).json(
            new APIResponse(400,{},"Video Not Found")
        )
    }
  
    
    await OwnerCheck(videoId,req);

    const deleteVideo=await Video.findByIdAndDelete(videoId).select("-isPublished -owner");

    if(!deleteVideo){
        return res.status(400).json(
            new APIResponse(400,{},"Error in Deleting the Video")
        )
    }

    return res.status(200).json(
        new APIResponse(200,{deleteVideo},"Video Deleted Succesfully")
    )
})

const togglePublishStatus = asyncHandler1(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId);
    if(!video){
        return res.status(400).json(
            new APIResponse(400,{},"Video Not Found")
        )
    } 
    
    await OwnerCheck(videoId,req);

    video.isPublished = !video.isPublished;
    await video.save();


    if(!video){
        return res.status(400).json(
            new APIResponse(400,{},"Error in Updating Status")
        )
    }

    return res.status(200).json(
        new APIResponse(200,video,"Status Updated SuccessFully")
    )
})


export {publishAVideo,getVideoById,updateVideo,deleteVideo,togglePublishStatus,getAllVideos}