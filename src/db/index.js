import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();



const connectDB = async () => {
    try {
       const connection= await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log(`Connected to MongoDB: ${connection.connection.host}`);//this will give the host 
    } catch (error) {
        console.log("MongoDB Connection Failed Error: ", error);
        process.exit(1);//learn from node 
        throw error;
    }
    }

export default connectDB;