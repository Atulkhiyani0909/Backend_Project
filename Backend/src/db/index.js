import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGO_URL);
const connectDB = async () => {
    try {
       const connectionInstance= await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);//this will give the host 
    } catch (error) {
        console.log("MongoDB Connection Failed Error: ", error);
        // process.exit(1);//learn from node 
        throw error;
    }
    }


export default connectDB;