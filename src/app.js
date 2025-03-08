import express, { urlencoded } from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));//diff servers to accept the request 


app.use(express.json({
    limit:'27kb' //how much we will accept the json data
}));

app.use(express.urlencoded({
    extended:true,
    limit:'27kb'
}));//taking the data from the url with limit 

app.use(express.static('public')); // to keep the files inour system if needed
app.use(cookieParser());//to set or read the cookies in the browser
export default app;