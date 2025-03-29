import dotenv from 'dotenv';
dotenv.config();


import connectDB from './db/index.js';
import app from './app.js';


// Step 2: To connect to MongoDB
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log('Server is running on port: ', process.env.PORT);
    })
})
.catch((error)=>{
    console.log('MongoDB Connection failed: ', error);
    throw error;
})










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