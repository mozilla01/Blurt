const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const ImageSchema = new Schema({
  url: {
    type: String,
  },
  filename: {
    type: String,
  },
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace(
    "/upload",
    "/upload/c_fill,g_face,h_90,w_90/f_png/r_max"
  );
});

ImageSchema.virtual("profile").get(function () {
  return this.url.replace(
    "/upload",
    "/upload/c_fill,g_face,h_200,w_200/f_png/r_max"
  );
});

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requested_incoming: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  requested_outgoing: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  image: ImageSchema,
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
