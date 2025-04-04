import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN  //to accept the request from diff origins * from all in development mode 
}));//diff servers to accept the request in production we give the link of our frontend


app.use(express.json({
    limit:'27kb' //how much we will accept the json  like data from the form 
}));

app.use(express.urlencoded({
    extended:true,
    limit:'27kb'
}));//taking the data from the url with limit 

app.use(express.static('public')); // to keep the files in our system if needed
app.use(cookieParser());//to set or read the cookies in the browser


import userRouter from  './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'

app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);


export default app;

//(err,req,res,next)  //this is the parameters taken to handle request