import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
});

// https://github.com/saintedlama/passport-local-mongoose
// You're free to define your User how you like. //
// Passport-Local Mongoose will add a username, //
// hash and salt field to store the username, the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const model = mongoose.model("User", UserSchema);

export default model;
