import {asyncHandler} from '../utils/asyncHandler.js'

const registerUser = asyncHandler(async (req, res) => {
    // get the data from user 
    // set the validation - all fields are required
    // get the files from user - avatar and coverImage - specially check avatar file is required
    // upload the files to cloudinary
    // check if user already exists
    // create the user object - for all the required fields otherwise some file are not required to set empty string
    // check create user in database - remove password and refreshToken from the response
    // return the response

   const {} = req.body()
})

export {registerUser}