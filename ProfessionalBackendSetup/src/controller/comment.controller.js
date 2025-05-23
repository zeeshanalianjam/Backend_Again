import mongoose from "mongoose";
import { Comment } from "../models/comments.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new apiError(400, {}, "Invalid video id");
  }

  const comments = await Comment.find({ video: videoId })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .populate("owner", "userName email");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        comments,
        "Comments found successfully..."
      ).setPagination(comments)
    );
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new apiError(400, {}, "Invalid video id");
  }

  if (!content) {
    throw new apiError(400, {}, "Content is required");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new apiResponse(201, comment, "Comment added successfully..."));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new apiError(400, {}, "Invalid comment id");
  }

  if (!content) {
    throw new apiError(400, {}, "Content is required");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    throw new apiError(404, {}, "Comment not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment updated successfully..."));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!mongoose.isValidObjectId(commentId)) {
    throw new apiError(400, {}, "Invalid comment id");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new apiError(404, {}, "Comment not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Comment deleted successfully..."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
