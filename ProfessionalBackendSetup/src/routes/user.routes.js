import express, {Router} from 'express'
import { loginUser, logoutUser, refreshAccessTokens, registerUser } from '../controller/user.controller.js'
import { upload } from '../middlewares/multer.middleware.js'
import { jwtVerify } from '../middlewares/auth.middleware.js'

const router = Router()

router.route('/register').post(upload.fields([
    {name : "avatar", maxCount : 1},
    {name : "coverImage", maxCount : 1}
]),registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("logout").post(jwtVerify ,logoutUser)
router.route("refresh-token").post( refreshAccessTokens)

export {router as userRouter}

