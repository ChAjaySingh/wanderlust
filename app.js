if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log("Connection to Db failed", err));
async function main() {
  await mongoose.connect(dbUrl);
}

// middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

// session
const store = MongoStore.create({
  mongoUrl:  dbUrl,
  crypto: {
    secret: process.env.SECRET,
    touchAfter: 24 * 60 * 60,
  }
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionConfig = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));
app.use(flash());

// passport configuration
// initializing passport
app.use(passport.initialize());
// getting access to session
app.use(passport.session());
// local-mongoose configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local variables
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});


// routes
// home route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// catch all route
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// error handling middleware
app.use((err, req, res, next) => {
  let {
    statusCode = 500,
    message = "haann kaha baat hai. Hame na pato kaha chahiye toe",
  } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});

// server listening
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
