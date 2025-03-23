import dotenv from 'dotenv';
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; //file system avaliable in Node.js to use files in the backend


    // Configuration of the cloudinary

    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET 
    });
    
    //OurTask { file --> localSystem --> cloudinary }
  const uploadToCloudinary = async(localFilePath)=>{
        try {
            if(!localFilePath) return null;
            console.log(localFilePath);

            //uploading the file to the cloudinary
            const file_Details=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto",
                folder:'backend'
            });
            
            //file has been successfully uploaded
            console.log("File uploaded to cloudinary")
            console.log(file_Details);

            fs.unlinkSync(localFilePath); //removing the files from the local storage after uploading them to cloudinary
            
            if(!file_Details) return null;
            return file_Details?.secure_url;
            
        } catch (error) {
            fs.unlinkSync(localFilePath); //removing file from our localStorage in case of the error 
            console.log("Error uploading to cloudinary: ", error);
            return null;
        }
  }


  export {uploadToCloudinary}


  //Uniform Resource Locator URL
  //Uniform Resource Identifier URI
  //Uniform Resource Network   URN