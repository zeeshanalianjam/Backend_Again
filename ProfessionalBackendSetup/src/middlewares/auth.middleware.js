import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const jwtVerify = asyncHandler(async (req, _, next) => {

try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new apiError(401, {}, "Unauthorized request")
        }
    
       const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
       if(!decodedToken){
        throw new apiError(401, {}, "Invalid accessToken")
       }
    
      const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
       if(!user){
        throw new apiError(401, {}, "Invalid accessToken or not found")
       }
    
       req.user = user
    
       next()
} catch (error) {
    throw new apiError(401, {}, "Unauthorized request and invalid accessToken")
}


})