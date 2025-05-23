import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/likes.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
      throw new apiError(400, {}, "Invalid video id");
    }

    const deleteExistingLike = await Like.findOneAndDelete({
      video: videoId,
      likedBy: req.user._id,
    });

    if (deleteExistingLike) {
      return res
        .status(200)
        .json(
          new apiResponse(200, { liked: false }, "Like removed successfully...")
        );
    }

    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });

    return res
      .status(201)
      .json(
        new apiResponse(
          201,
          { liked: true, like: newLike },
          "Like added successfully..."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, {}, "Internal server error" + error.message));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  try {
    const { commentId } = req.params;
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
      throw new apiError(400, {}, "Invalid comment id");
    }

    const deleteExistingLike = await Like.findOneAndDelete({
      comment: commentId,
      likedBy: req.user._id,
    });

    if (deleteExistingLike) {
      return res
        .status(200)
        .json(
          new apiResponse(200, { liked: false }, "Like removed successfully...")
        );
    }

    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });

    return res
      .status(201)
      .json(
        new apiResponse(
          201,
          { liked: true, like: newLike },
          "Like added successfully..."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, {}, "Internal server error" + error.message));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  try {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
      throw new apiError(400, {}, "Invalid tweet id");
    }

    const deleteExistingLike = await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    if (deleteExistingLike) {
      return res
        .status(200)
        .json(
          new apiResponse(200, { liked: false }, "Like removed successfully...")
        );
    }

    const newLike = await Like.create({
      tweet: tweetId,
      likedBy: req.user._id,
    });

    return res
      .status(201)
      .json(
        new apiResponse(
          201,
          { liked: true, like: newLike },
          "Like added successfully..."
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, {}, "Internal server error" + error.message));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  try {
    //TODO: get all liked videos
    const likedVideos = await Like.find({ likedBy: req.user._id })
      .populate("video")
      .populate("likedBy");

    if (!likedVideos) {
      return res
        .status(404)
        .json(new apiError(404, {}, "No liked videos found"));
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, likedVideos, "Liked videos found successfully...")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new apiError(500, {}, "Internal server error" + error.message));
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
