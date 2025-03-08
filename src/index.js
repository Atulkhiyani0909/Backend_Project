import dotenv from 'dotenv';
dotenv.config({//this is the experimental feature
    path: './env'
});

import mongoose from 'mongoose';
import connectDB from './db/index.js';


// Step 2: To connect to MongoDB
connectDB();










// Step 1 To connect to MongoDB 

// import express from 'express';
// const app = express();

// ;(async ()=>{//using IIFE to call the connect with DB as this are immetiately called function
//     try{
//          await  mongoose.connect(`${process.env.MONGO_URI}/ ${process.env.DB_NAME}`);
//          app.on("error",(error)=>{
//                 console.log('Error: ', error);
//                 throw error;
//          })

//          app.listen(process.env.PORT,()=>{
//             console.log('Server is running on port: ', process.env.PORT);
//          })
//     }catch(error){
//         console.log('Error: ', error);
//         throw error;
//     }

// })();