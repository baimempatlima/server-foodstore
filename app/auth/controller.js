const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.status(200).json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(204).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select("-__v -createdAt -updatedAt -cart_items -token");
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ user, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(200).json({ error: 1, message: "email or password incorect" });

    let signed = jwt.sign(user, config.secretKey);

    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

    res.status(200).json({
      message: "Login successfully",
      user: { name: user.full_name, email: user.email, role: user.role },
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });

  if (!token || !user) {
    res.status(200).json({
      error: 1,
      message: "No User Found",
    });
  }
  return res.status(200).json({
    error: 0,
    message: "logout berhasil",
  });
};

const me = (req, res, next) => {
  if (!req.user) {
    res.status(200).json({
      error: 1,
      message: "you are not login or token expired",
    });
  }
  res.status(200).json(req.user);
};

module.exports = { register, login, localStrategy, logout, me };
