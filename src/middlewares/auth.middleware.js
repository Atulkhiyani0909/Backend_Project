//here we can write the our authMiddleware which we can use 
//we are verifying the user on the basis of the the refresh token and access token using the jwt.verify() method
//id there is the true login I can add the req.user as the req is the obj we can add the new field in it

import { asyncHandler1 } from "../utils/asyncHandler.js";
import { APIError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT= asyncHandler1(async(req,_,next)=>{
  try {
      //beacuse we send the token in headers like Authorization Bearer <token>
     const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
  
     if(!token) {
      throw new APIError(401,"Unauthorized access");
    }
  
    const decoded=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded); 
  
    const userLoggedIn=await User.findById(decoded?._id).select("-password -refreshToken");
  
    if(!userLoggedIn) {
      throw new APIError(401,"Invalid access token");
    }
  
  
    //making the new request
    req.user=userLoggedIn;
    next();
  } catch (error) {
    throw new APIError(401,error?.message || "Invalid access token");
  }
})