import {asyncHandler1} from '../utils/asyncHandler.js';

const registerUser=asyncHandler1(async(req,res)=>{
    
    
     res.status(200).json({
        message:'User registered successfully',
    })
})



export {registerUser}