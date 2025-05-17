import { apiError } from '../utils/apiError.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { fileUploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.models.js';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async(userId) => {
   try {
     const user = await User.findById(userId)
     
     const accessToken = await user.generateAccessToken();
     const refreshToken = await user.generateRefreshToken()

     user.refreshToken = refreshToken
     await user.save({validateBeforeSave: false})

     return {
        accessToken,
        refreshToken
     }
   } catch (error) {
      throw new apiError(500, null, "Something went wrong while generating tokens")
   }
}

// register user Api
const registerUser = asyncHandler(async (req, res) => {
    // get the data from user 
    // set the validation - all fields are required
    // check if user already exists
    // get the files from user - avatar and coverImage - specially check avatar file is required
    // upload the files to cloudinary
    // create the user object - for all the required fields otherwise some file are not required to set empty string
    // check create user in database - remove password and refreshToken from the response
    // return the response

   const {userName, fullName, email, password} = req.body

  //  console.log('req.body',req.body);
   
  

   if([userName, fullName, email, password].some((field) => field?.trim() === "")){
        throw new apiError(400, null, "Please fill all the fields", false)
   }

    const existedUser = await User.findOne({
        $or: [{userName}, {email}]
    })   

    if(existedUser){
        throw new apiError(409, null, "User with username or email already exist")
    }

  //  const avatarLocalPath = await req.files?.avatar[0]?.path
  //  const coverImageLocalPath = await req.files?.coverImage[0]?.path

let avatarLocalPath;

   if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0){
    avatarLocalPath = await req.files.avatar[0].path
   }

   let coverImageLocalPath;

   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = await req.files.coverImage[0].path
   }

  //  console.log('req.files',req.files);
   

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
    new apiResponse(200, {createdUser}, "User Register Successfylly...")
 )

   
})

// login user Api
const loginUser = asyncHandler(async (req, res) => {
   //  get the data from the user 
   // set the validation of data - all fields are required
   // check if user exist - username or email
   // check if password is correct
   // create the token - refreshToken and accessToken
   // return the response

 const {userName, email, password} = req.body

 if([userName, email, password].some((field) => field?.trim() === "" || field === undefined)){
   throw new apiError(400, null, "All fields are required")
 }

 const existedUser = await User.findOne({
    $or: [{userName}, {email}]

  })

  // console.log("existedUser", existedUser);
  

 if(!existedUser){
    throw new apiError(404, null, "User not found")
 }

 const isPasswordCorrect = await existedUser?.isCorrectPassword(password)


 if(!isPasswordCorrect){
    throw new apiError(401, null, "Invalid credentials")
 }
 
 const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(existedUser._id)

 const loginUser = await User.findById(existedUser._id).select(" -password -refreshToken")

 const options = {
   httpOnly: true,
   secure: true,
 }



 return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new apiResponse(200, {user: loginUser, accessToken, refreshToken }, "User login successfully..."))


})

// logout user Api
const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(
   req.user._id, 
   {

   $set: {
      refreshToken: undefined
   }

  },
   {
    new: true,
  }
)

  const options = {
   httpOnly : true,
   secure : true
  }

  return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new apiResponse(200, {}, "User logout successfully..."))

})

// refresh token Api
const refreshAccessTokens = asyncHandler(async (req, res) => {
   
  try {
    const inCommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
 
    if(!inCommingRefreshToken){
       throw new apiError(401, null, "Unauthorized request")
    }
 
   const decodedToken = jwt.verify(inCommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
 
   if(!decodedToken){
     throw new apiError(401, null, "Invalid refreshToken")
   }
 
   const user = await User.findById(decodedToken._id).select("-password -refreshToken")
 
   if(!user){
     throw new apiError(401, null, "Invalid refreshToken or used")
   }
 
   if(user.refreshToken !== inCommingRefreshToken){
     throw new apiError(401, null, "RefreshToken is expired or used")
   }
 
   const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
   const options = {
     httpOnly: true,
     secure: true
   }
 
   return res
   .status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newRefreshToken, options)
   .json(new apiResponse(200, {user, accessToken, refreshToken: newRefreshToken}, "Access token refreshed successfully..."))
  } catch (error) {
    throw new apiError(401, null, "Unauthorized request")
  }

})

// change user password Api
const changeUserCurrentPassword = asyncHandler(async (req, res) => {
  const {currentPassword, newPassword} = req.body

  if([currentPassword, newPassword].some((field) => field?.trim() === "" || field === undefined)){
    throw new apiError(400, null, "All fields are required")
  }

  const user = await User.findById(req.user._id)

  const isPasswordCorrect = await user?.isCorrectPassword(currentPassword)

  if(!isPasswordCorrect){
    throw new apiError(401, null, "Invalid current password")
  }

  user.password = newPassword

  await user.save({validateBeforeSave: false})

  return res.status(200).json(new apiResponse(200, {}, "Password changed successfully..."))

  
})

// get current user Api
const getCurrentUser = asyncHandler(async (req, res) => {

  return res.status(200).json(new apiResponse(200, {user: req.user}, "User found successfully..."))
})

// update user details Api
const updateUser = asyncHandler(async (req, res) => {

 const {userName, email, fullName} = req.body

  if([userName, email, fullName].some((field) => field?.trim() === "" || field === undefined)){
    throw new apiError(400, null, "All fields are required")
  }

 const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        userName,
        email,
        fullName
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken")

  return res.status(200).json(new apiResponse(200, {user}, "User updated successfully..."))

  }
)


const updateAvatarLocalPath = asyncHandler(async (req, res) => {
  const avatarImage = await req.file?.path

  if(!avatarImage){
    throw new apiError(400, null, "Please upload avatar image")
  }

  const avatar = await fileUploadOnCloudinary(avatarImage)

  if(!avatar.url){
    throw new apiError(400, null, "Error while uploading avatar")
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken")

  if(!user){
    throw new apiError(400, null, "Error while updating avatar")
  }
  
  return res.status(200).json(new apiResponse(200, {user}, "Avatar updated successfully..."))

})

const updateCoverImageLocalPath = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
    throw new apiError(400, null, "Please upload cover image")
  }

  const coverImage = await fileUploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
    throw new apiError(400, null, "Error while uploading cover image")
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        coverImage: coverImage.url
      }
    },
    {
      new: true
    }
  ).select("-password -refreshToken")

  if(!user){
    throw new apiError(400, null, "Error while updating cover image")
  }

  return res.status(200).json(new apiResponse(200, {user}, "Cover image updated successfully..."))


  
})

export {registerUser, loginUser, logoutUser, refreshAccessTokens, changeUserCurrentPassword, getCurrentUser, updateUser, updateAvatarLocalPath, updateCoverImageLocalPath}

