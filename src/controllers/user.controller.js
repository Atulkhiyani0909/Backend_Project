import {asyncHandler1} from '../utils/asyncHandler.js';
 import {  validationResult } from 'express-validator';
import {APIError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';
import {APIResponse} from '../utils/ApiResponse.js';


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
      return res.status(400).json({ errors: errors.array() });
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
  

   if(!createdUser){
    throw new  APIError(500,"Something Went Wrong");
   }
   
    return res.status(201).json(
        new APIResponse(200,createdUser,"User created successfully")
    )
})



export {registerUser}