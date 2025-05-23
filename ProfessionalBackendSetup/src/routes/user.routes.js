import express, {Router} from 'express'
import { changeUserCurrentPassword, getCurrentUser, getUserProfileDetails, getWatchHistory, loginUser, logoutUser, refreshAccessTokens, registerUser, updateAvatarLocalPath, updateCoverImageLocalPath, updateUser } from '../controller/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { jwtVerify } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(upload.fields([
    {name : "avatar", maxCount : 1},
    {name : "coverImage", maxCount : 1}
]),registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(jwtVerify ,logoutUser)
router.route("/refresh-token").post( refreshAccessTokens)
router.route("/change-password").post(jwtVerify, changeUserCurrentPassword)
router.route("/current-user").get(jwtVerify, getCurrentUser)
router.route("update-user").patch(jwtVerify, updateUser)
router.route("/update-avatar").patch(jwtVerify, upload.single("avatar"), updateAvatarLocalPath)
router.route("/update-coverImage").patch(jwtVerify, upload.single("coverImage"), updateCoverImageLocalPath)
router.route("/c/:username").get(jwtVerify, getUserProfileDetails)
router.route("/get-watch-history").get(jwtVerify, getWatchHistory)

export {router as userRouter}

