import mongoose ,{Schema} from "mongoose";

const subscriptionSchema=new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,//one who subscribed the channel
        ref:'User'
    },
    channel:{
        type:Schema.Types.ObjectId,//the channel which the subscriber is subscribing to
        ref:'User'
    }
},{timestamps:true});

export const Subscription=mongoose.model('Subscription',subscriptionSchema); 