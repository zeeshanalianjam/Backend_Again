import mongoose, { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    userName : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName : {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    avatar: {
        type: String, // URL from Cloudinary
        required: true
    },
    coverImage: {
        type: String, // URL from Cloudinary
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Video'
        }
    ]
    
    
}, {timestamps: true})


userSchema.pre('save', async function (next){
    if(!this.isModified("password")) return next()

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.method.isCorrectPassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.method.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            userName: this.userName,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: process.env.ACCESS_TOKEN_EXPIRY}
    )
}
userSchema.method.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: process.env.REFRESH_TOKEN_EXPIRY}
    )
}

export const User = model('User', userSchema)