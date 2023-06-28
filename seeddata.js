const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/social-media");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const push = async () => {
  const u1 = new User({
    firstname: "Arya",
    lastname: "Dubal",
    email: "123@gmail.com",
    username: "arya@123",
    password: "12334",
  });

  const res = await u1.save();
  console.log(res);
};

push();
