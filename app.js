if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");

const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const userRoute = require("./routes/userRoute");
const CRUDpostRoute = require("./routes/CRUDpostRoute");
const requestRoute = require("./routes/requestRoute");
const mainPageRoute = require("./routes/mainPageRoute");
const singlePostRoute = require("./routes/singlePostRoute");
const imageUploadRoute = require("./routes/imageUploadRoute");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");

mongoose
  .connect("mongodb://127.0.0.1:27017/social-media")
  .then(() => {
    console.log("MONGO CONNECTION OPEN !!");
  })
  .catch(err => {
    console.log("OH NO MONGO ERROR");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "chooselifenotengineering",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", CRUDpostRoute);
app.use("/", mainPageRoute);
app.use("/", requestRoute);
app.use("/", userRoute);
app.use("/", singlePostRoute);
app.use("/", imageUploadRoute);

app.get("/", (req, res) => {
  res.send("Social Media App");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no ! Something went wrong !";
  res.status(statusCode).render("pages/error", { err });
});

app.listen(3001, () => {
  console.log("Listening on port 3001\nhttp://127.0.0.1:3001/social-media/");
});
