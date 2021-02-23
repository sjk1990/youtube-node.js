// model(data): document name, schema: shape
import mongoose from "mongoose";

//schema, id는 자동생성
const VideoSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    //error message when without fileUrl
    required: "File URL is required",
  },
  title: {
    type: String,
    required: "Tilte is required",
  },
  description: String,
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  // videos의 creator를 User 스키마의 objectId와 연결
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//model :: model-name:Video, model-shape(schema):VideoSchema
const model = mongoose.model("Video", VideoSchema);
export default model;
