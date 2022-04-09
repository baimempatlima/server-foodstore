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
    return res.json(user);
  } catch (error) {
    //1 cek kemungkinan kesalahan terkait validasi
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    //error lainnya
    next(error);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select("-__v -createdAt -updatedAt -cart_items -token");
    if (!user) {
      return done();
    }
    if (bcrypt.compareSync(password, user.password)) {
      // const { password, ...userWithoutPassword } = user.toJSON();
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (error, user) {
    if (error) return next(error);

    if (!user) return res.json({ error: 1, message: "Email or Password incorrect" });
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });

    res.json({
      message: "Login Successfully",
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  let token = getToken(req);

  let user = await User.findOneAndUpdate({ token: { $in: [token] } }, { $pull: { token: token } }, { useFindAndModify: false });

  if (!token || !user) {
    res.json({
      error: 1,
      message: "No User Found !!",
    });
  }
  return res.json({
    error: 0,
    message: "Logout Berhasil",
  });
};

const me = (req, res, next) => {
  if (!req.user) {
    res.json({
      error: 1,
      message: "You'not Login or Token Expired",
    });
  }
  req.json(req.user);
};
module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
