import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=new Schema({
    videoFile:{
        type:String,//cloudinary url
        required:true
    },
    thumbnail:{
        type:String,//cloudinary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,  //from cloudinary
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

//this allow to to write the aggeigation pipelines on the Schema this is more advanced search in DB it is more usefull than tradinational find() method

videoSchema.plugin(mongooseAggregatePaginate);   

export const Video=mongoose.model('Video',videoSchema);