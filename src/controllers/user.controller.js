import {asyncHandler1} from '../utils/asyncHandler.js';
 import {  validationResult } from 'express-validator';
import {APIError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';
import {APIResponse} from '../utils/ApiResponse.js';
import jwt, { decode } from "jsonwebtoken"

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
   let coverImageLocalPath=req.files?.coverImage[0]?.path
   if(!avatarLocalPath){
    throw new APIError(400,"Avatar Img is required");
   }
   
   const avatar=await uploadToCloudinary(avatarLocalPath);
   console.log(avatar);
   const coverImage=await uploadToCloudinary(coverImageLocalPath);

   if(!avatar){
     throw new APIError(500,"Failed to upload Avatar to Cloud");
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


const refreshAccessToken=asyncHandler1(async(req,res)=>{
  //we are taking the refreshToken from the user cookies and serching it and sending them back a refreshed Access Token 
  const incommingRefreshToken = req.cookie.AccessToken || req.body.AccessToken;

  if (!incommingRefreshToken) {
    throw new APIError(401, "Unauthorized Request");
  }

  try {
    const decoded=await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
    
    const user=await User.findById(decode?._id);
  
    if(!user){
      throw new APIError(401,"Invalid Refresh Token");
    }
  
    if(incommingRefreshToken !== user?.refreshToken) {
      throw new APIError(401,"Refresh Token is Expired or Used");
    }
  
    
  
    const options={
      httpOnly:true,
      secure:true
    }
  
    let {accessToken , refreshToken}=await AccessAndRefreshToken(user._id);
  
    return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
      new APIResponse(200,{
        refreshToken:refreshToken,accessToken:accessToken
      },
      "Accessed Token Refereshed Successfully"  
    )
    );
    
  
  } catch (error) {
    throw new APIError(401,error?.message || "Invalid Refresh Token");
  }
})

export {registerUser ,loginUser,logoutUser, refreshAccessToken}