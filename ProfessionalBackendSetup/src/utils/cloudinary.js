import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

   // Configuration
   cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const fileUploadOnCloudinary = async(localPath) => {
    try {
        if(!localPath) return null;

        // upload file on cloudinary
       const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto"
        })

        // success message
        // console.log('file has been successfully upload on cloudinary', response.url );

        // console.log(`check the response for test : `, JSON.stringify(response));

        fs.unlinkSync(localPath)
        // console.log('file has been deleted from local directory');
        
        return response
        
    } catch (error) {
        fs.unlinkSync(localPath)
        console.log('error while uploading file on cloudinary', error)
        return null
    }
}

export {fileUploadOnCloudinary}




















