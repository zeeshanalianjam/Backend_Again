import mongoose, { model, Schema } from "mongoose";
import aggregatepaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videFile : {
        type: String, // URL from Cloudinary
        required: true,
    },
    thumbnail : {
        type: String, // URL from Cloudinary
        required: true,
    },
    title : {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    duration : {
        type: Number,
        required: true,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    }, 
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
},{timestamps: true})

videoSchema.plugin(aggregatepaginate)

export const Video = model("Video", videoSchema)