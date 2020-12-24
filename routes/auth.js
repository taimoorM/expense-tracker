const { Router } = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = Router();

function extractUser(req) {
  const { username, _id } = req.user;
  return { user: { username, _id } };
}

router.get("/user", (req, res) => {
  if (req.user) {
    res.json(extractUser(req));
  } else {
    res.json({ user: null });
  }
});

//User Signup
router.post(
  "/sign-up",
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      await User.register({ username }, password);
    } catch (e) {
      if (e.name === "UserExistsError") {
        return res.status(400).json({ message: "UserExistsError" });
      }
      return res
        .status(500)
        .json({ message: "There was an error when signing up the user" });
    }
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    res.json(extractUser(req));
  }
);

//User logout
router.post("/logout", (req, res) => {
  if (req.user) {
    req.logOut();
    res.json({ message: "Logged out" });
  } else {
    res.json({ message: "No user to log out" });
  }
});

//User login
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json(extractUser(req));
});

//Change password
router.post(
  "/update-password",
  (req, res, next) => {
    if (!req.user) {
      return res.send({ message: "No user to change the password" });
    }
    next();
  },
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Invalid Request" });
    }
    try {
      const user = await User.findById(req.user._id);
      await user.changePassword(oldPassword, newPassword);
      res.json({ message: "success" });
    } catch (e) {
      if (e.name === "IncorrectPasswordError") {
        return res.status(400).json({ message: "IncorrectPasswordError" });
      }
      return res.status(500).json({ message: "There was an error" });
    }
  }
);

module.exports = router;
