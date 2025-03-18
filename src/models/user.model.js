import mongoose,{Schema} from "mongoose"; //we can directly import Schema here also or use mongoose.Schema

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

let userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true, //this optimizes the searching feild in the database faster than normal search
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
        index:true, //this optimizes the searching feild in the database faster
    },
    avatar:{
        type:String,//cloudinary url 
        required:true,
    },
    coverImage:{
        type:String, //cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:'Video',
        }
    ],
    refreshToken:{
        type:String,// It is a unique token that is used to obtain additional access tokens. This allows you to have short-lived access tokens without having to collect credentials every time one expires.
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:6
    }
},{
    timestamps:true, //to automatically add createdAt and updatedAt fields
});


//we are using hooks here -> Hooks means to perform some actions just before saving the data to the DB 
//we will use bcrypt to secure our password just before saving the data to the DB

userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return next();  // isModefied is the property of the MongoDb to check whether the field is modified or not

       // .pre() to run before saving the data to the DB
    //hashing the password before saving it to the database using bcrypt using 10 rounds 
      this.password=bcrypt.hash(this.password,10);
      next();
    
}); 



//omparing the passwords

userSchema.methods.comparePassword=async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
}


userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        fullname:this.fullname,
        email:this.email
    },
    process.env.ACCESS_TOKEN,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRATION
    }
)
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRATION
    }
)
}



export const User=mongoose.model('User',userSchema);