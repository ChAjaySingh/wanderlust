const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  if (req.headers.referer) {
    try {
      const refererUrl = new URL(req.headers.referer);
      req.session.dirLogin = refererUrl.pathname;
    } catch (e) {
      req.session.dirLogin = "/listings";
    }
  } else {
    req.session.dirLogin = "/listings";
  }
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect(res.locals.originalUrl);
    });
  } catch (err) {   
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  if (req.headers.referer) {
    try {
      const refererUrl = new URL(req.headers.referer);
      req.session.dirLogin = refererUrl.pathname;
    } catch (e) {
      req.session.dirLogin = "/listings";
    }
  } else {
    req.session.dirLogin = "/listings";
  }
  res.render("users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "welcome to Wanderlust");
  res.redirect(res.locals.originalUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
};
