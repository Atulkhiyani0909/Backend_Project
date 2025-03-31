import {asyncHandler1} from '../utils/asyncHandler.js';
 import {  validationResult } from 'express-validator';
import {APIError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';
import {APIResponse} from '../utils/ApiResponse.js';
import jwt, { decode } from "jsonwebtoken"
import mongoose from 'mongoose';

const AccessAndRefreshToken =async (userId)=>{
      try {
        const user = await User.findById(userId);//finding user based on the id of the user
         const refreshToken = await user.generateRefreshToken();
         const AccessToken=await user.generateAccessToken();
         user.refreshToken=refreshToken;
         await user.save({validateBeforeSave:false});//because when we are savinf the password with validation and all stop that all here 

         return {AccessToken,refreshToken};
      } catch (error) {
        throw new APIError(500,"Something went wrong");
      }
}

const registerUser=asyncHandler1(async(req,res)=>{
    //taking data from users
    //validation -> not empty 
    //already exists
    //sending img to cloudinary
    //create user object
    //saving data to db 

    //YOU CAN USE THIS ALSO
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log( errors.array());
      return res.status(400).json(new APIResponse(400, errors.message));
    }
      
     const {Name,username,email,password}=req.body;

    //you can add more validation here make your own validation using our classs APIError
//    if(
//     [username,email,password,Name].some((val)=>val?.trim()==="")//this is the advanced code checking if any of the field is empty return true 
//    ){
//     throw new APIError(400,"All Fields are Required");
//    }

   let existedUser=await User.findOne({//operator to check more things in the DB 
      $or:[{ username },{ email }]//to check both with or in DB 
   })

   if(existedUser){
      throw new APIError(409,"User already exists");
   }
    
   
   let avatarLocalPath=req.files?.avatar[0]?.path
   console.log("This is the avatar Img" , avatarLocalPath);
   
   let coverImageLocalPath=req.files?.coverImage[0]?.path
   console.log("This is the cover Img" , coverImageLocalPath);
   
   if(!avatarLocalPath){
    throw new APIError(400,"Avatar Img is required");
   }

   if(!coverImageLocalPath){
    throw new APIError(400,"Cover Img is required");
   }
   
   const avatar=await uploadToCloudinary(avatarLocalPath);
   console.log(avatar);
   const coverImage=await uploadToCloudinary(coverImageLocalPath);

   if(!avatar){
     throw new APIError(500,"Failed to upload Avatar to Cloud");
   }

   if(!coverImage){
    throw new APIError(500,"Failed to upload cover Image to Cloud");
  }



   let newUser=await User.create({
       Name:Name,
       username:username.toLowerCase(),
       email:email,
       password:password,
       avatar:avatar,
       coverImage:coverImage
   })
 
   let createdUser=await User.findById(newUser._id).select(
     "-password -refreshToken" //this is to remove the password and refresh token from the response
   )
   
   let {AccessToken,refreshToken}=await AccessAndRefreshToken(createdUser._id);

   if(!createdUser){
    throw new  APIError(500,"Something Went Wrong");
   }
   
    return res.status(201).cookie("accessToken" , AccessToken).cookie("refreshToken", refreshToken).json(
        new APIResponse(200,{
          user:createdUser,refreshToken,AccessToken
        },"User created successfully")
    )
})


const loginUser=asyncHandler1(async(req,res)=>{
  //taking data from users
  //validation -> not empty 
  //check password
  //generate token
  //return token

 const errors=validationResult(req);
 if(!errors.isEmpty()) {
   console.log(errors.array());
   console.log(errors.message);
    return res.status(400).json(new APIResponse(400,errors.message));
 }

  let {username,email,password}=req.body;

  let user=await User.findOne({
    $or:[{username},{email}]
  });

  if(!user){
    throw new APIError(401,"User Doesn't Exists");
  }


  let isCorrect=await user.comparePassword(password);
  if(!isCorrect){
    throw new APIError(401,"Invalid Credentials");
  }


   const {AccessToken,refreshToken}=await AccessAndRefreshToken(user._id);
   

   const loggedInUser=await User.findById(user._id).select("-password  -refreshToken");

   const options={  //this is because now this cookies are not modifiable by the frontend but this can be modified by backend only 
    httpOnly:true,   
    secure:true
   }

//sending the cookie in the response  and sending the user loggedInUser refresh token access token as json response
   return res.status(200).cookie("accessToken" ,AccessToken,options).cookie("refreshToken", refreshToken,options).json(
    new APIResponse(200,{
      user:loggedInUser ,refreshToken ,AccessToken
    },
    "User Logged In Successfully"
  )
   ); 
})


const logoutUser=asyncHandler1(async(req,res)=>{
  let updatedUser=await User.findByIdAndUpdate(req.user._id,{
    $unset:{
      refreshToken:""
    }
  },
  {
    new:true
  }
)
console.log(updatedUser);

const options={  //this is because now this cookies are not modifiable by the frontend but this can be modified by backend only 
  httpOnly:true,   
  secure:true
 }


 return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(
  new APIResponse(200,{},"User Logged Out Successfully"));
  
})


const refreshAccessToken = asyncHandler1(async (req, res) => {
  // 🧠 Step 1: Get refresh token from cookie or body
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIError(401, "Unauthorized Request");
  }

  try {
    // 🧪 Step 2: Verify refresh token
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 👤 Step 3: Find user
    const user = await User.findById(decoded?._id);

    if (!user) {
      throw new APIError(401, "User not found");
    }

    // ❌ Step 4: Compare incoming refreshToken with stored one
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new APIError(401, "Refresh Token is Expired or Reused");
    }

    // 🔁 Step 5: Generate new tokens
    const { accessToken, refreshToken } = await AccessAndRefreshToken(user._id);

    // 🔒 Step 6: Update user's refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    // 🍪 Step 7: Set new tokens as cookies
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict", // extra protection
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new APIResponse(
          200,
          {
            refreshToken,
            accessToken,
          },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid Refresh Token");
  }
});


const currPasswordChange=asyncHandler1(async(req,res)=>{
   const {oldPassword,newPassword} = req.body;
   const user=await User.findById(req.user?._id).lean();// this lean() will convert the mongoose object to the plain object
   console.log((user));
   const isPassword=await user.comparePassword(oldPassword);
   if(!isPassword){
     throw new APIError(401,"Invalid Password");
   }

   user.password=newPassword;
   await user.save({validateBeforeSave:false});

   return res.status(200).json(new APIResponse(200,{},"Password Changed Successfully"));
   
})


const getCurrentUser=asyncHandler1(async(req,res)=>{
  return res.status(200).json(new APIResponse(200,req.user,"Current User Details"));
})

const updateUser=asyncHandler1(async(req,res)=>{
  const {Name,email} =req.body;

  const user=await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      Name:Name,
      email:email
    }
  },{
    new:true
  }).select("-password -refreshToken");

  return res.status(200).json(new APIResponse(200,user,"User Updated Successfully"));
})


const updateUserAvatar=asyncHandler1(async(req,res)=>{
  console.log("This is the avatar ",req.file);
  
  
  let avatarFilePath=req.file?.path;
  if(!avatarFilePath){
    throw new APIError(400,"Avatar Image is required");
  }
  let url=await uploadToCloudinary(avatarFilePath);

  if(!url){
    throw new APIError(500,"Failed to upload Avatar to Cloud");
  }

  const user=await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      avatar:url
    }
  },{
    new:true
  }).select("-password -refreshToken");


  return res.status(200).json(new APIResponse(200,user,"Avatar Updated Successfully"));

})


const updateUserCoverImage=asyncHandler1(async(req,res)=>{
  req.file=req.body;
  let CoverImgPath=req.file?.path;
  if(!CoverImgPath){
    throw new APIError(400,"Cover Image is required");
  }
  let url=await uploadToCloudinary(CoverImgPath);
  if(!url){
    throw new APIError(500,"Failed to upload Avatar to Cloud");
  }

  const user=await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      coverImage:url
    }
  },{
    new:true
  }).select("-password -refreshToken");


  return res.status(200).json(new APIResponse(200,user,"Cover Image Updated Successfully"));

})

const getUserChannelProfile=asyncHandler1(async(req,res)=>{
    const {username}=req.params

    if(!username?.trim()){
      throw new APIError(400,"userName is missing");
    }
    console.log(username);
    

    //this is the aggregate it taks the array and we can write the pipelines inside it 
    const channel =await User.aggregate([
      {
      $match:{
        username:username?.toLowerCase(),
      }
    },
    {
      $lookup:{    //this means that search the Users _id(local field) in the foreign field(channel) in the subscription collection as the all output in the array of the subscribers
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
      }
    },
      {
       $lookup:{// this tell that how many channel the user has subscribed to
          from:"subscriptions",
          localField:"_id",
          foreignField:"subscriber",
          as:"subscriptions"
        }
      },
      {
        $addFields:{//this field are added in the final answer obj.
          subscriberCount:{
            $size:"$subscribers"
          },
          subscriptionCount:{
            $size:"$subscriptions"
          },
          isSubscribed:{// here we are checking that user is subscribed to the list of the channel or not
            $cond:{
              if:{ //$in means that check inside  [what , where] 
                $in:[req.user?._id,"$subscribers.subscriber"]
              },
              then:true,
              else:false
            }
          }
        }
      },
      {
        $project:{//this is to remove the fields from the final output and what to include
          Name:1,
          subscriberCount:1,
          username:1,
          isSubscribed:1,
          avatar:1,
          coverImage:1,
          subscriptionCount:1,
          email:1
        }
      }
  ]);

  console.log("This what aggreate returns ",channel);
  

  if(!channel?.length){
    throw new APIError(404,"Channel Not Found");
  }

  return res.status(200).json(new APIResponse(200,channel,"Channel Profile"));
})

const getWatchHistory=asyncHandler1(async(req,res)=>{

  //take the user from the req.user search it in the video and watchHistory of the user using the lookup and apply the nested lookup as the there is the owner in the video field inside the video 

  const user=await User.aggregate([{
    $match:{
      _id:new mongoose.Types.ObjectId(req.user._id)//this is to convert the string (req.user._id) to the object id as the id in the DB is in the object id format
    },
  },
  {
    $lookup:{
      from:"videos",
      localField:"watchHistory",
      foreignField:"_id",
      as:"watchHistory",
      pipeline:[//now we are inside the videos and we want owners as they are users
        {
          $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[//a swe want to apply the pipeline inside the owner as we want to get the name and avatar of the owner
              {
                $project:{
                  Name:1,
                  username:1,
                  avatar:1
                }
              }
            ]
          }
        },
        {
          $addFields:{
            owner:{
              $first:"$owner"//this is to get the first element of the array as we are getting the array of the owner
            }
          }
        }
      ]
    }
  }
])


return res.status(200).json(new APIResponse(200,
  user[0].watchHistory
,"Watch History Fetched Successfully"));
})
  
export {registerUser ,loginUser,logoutUser, refreshAccessToken, getCurrentUser,currPasswordChange,updateUser,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}