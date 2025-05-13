import { apiError } from '../utils/apiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { fileUploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // get the data from user 
    // set the validation - all fields are required
    // check if user already exists
    // get the files from user - avatar and coverImage - specially check avatar file is required
    // upload the files to cloudinary
    // create the user object - for all the required fields otherwise some file are not required to set empty string
    // check create user in database - remove password and refreshToken from the response
    // return the response

   const {userName, fullName, email, password} = req.body()
   console.log("email", email);

   if([userName, fullName, email, password].some((field) => field?.trim() === "")){
        throw new apiError(400, null, "Please fill all the fields", false)
   }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })   

    if(existedUser){
        throw new apiError(409, null, "User with username or email already exist")
    }

   const avatarLocalPath = await req.files?.avatar[0]?.path
   const coverImageLocalPath = await req.files?.coverImage[0]?.path

   if(!avatarLocalPath){
        throw new apiError(400, null, "Please upload avatar", false)
   }

  const avatar = await fileUploadOnCloudinary(avatarLocalPath)
  const coverImage = await fileUploadOnCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new apiError(400, null, "Please upload avatar", false)
  }

 const user = await User.create({
    userName,
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage : coverImage?.url || ""
  })

 const createdUser = await User.findById(user._id).select(" -password -refreshToken")

 if(!createdUser){
    throw new apiError(500, null, "Error in registering the user")
 }

 return res.status(201).json(
    new apiResponse(200, {data: createdUser}, "User Register Successfylly...")
 )

   
})

export {registerUser}