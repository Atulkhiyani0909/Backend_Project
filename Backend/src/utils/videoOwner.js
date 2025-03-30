import { Video } from "../models/video.model.js";
import { mongoose } from "mongoose";

export const OwnerCheck=async(videoId , req)=>{

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
      
    
    if(!((req.user?._id).toString() === (videoOwner[0].Owner._id).toString())){
        console.log("You Can't Edit this Video not Owner");
        return res.status(403).json(
            new APIResponse(403,{},"Not an Owner")
        );
    }

}