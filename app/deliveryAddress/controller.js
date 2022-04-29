const { subject } = require("@casl/ability");
const { policyfor } = require("../../utils");
const DeliveryAddress = require("./model");

// const index = async (req, res, next) => {
//   try {
//     let user = req.user;
//     let address = await DeliveryAddress.find();
//     if (user.role === "user") {
//       address = await DeliveryAddress.find({ user: user._id });
//     }
//     return res.status(200).json(address);
//   } catch (err) {
//     next(err);
//   }
// };

const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 10 } = req.query;
    let count = await DeliveryAddress.find({ user: req.user._id }).countDocuments();
    let address = await DeliveryAddress.find({ user: req.user._id }).skip(parseInt(skip)).limit(parseInt(limit)).sort("-createdAt");

    return res.json({ data: address, count });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;
    let user = req.user;
    let address = new DeliveryAddress({ ...payload, user: user._id });
    await address.save();
    return res.status(200).json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(200).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    let policy = policyfor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.status(200).json({
        error: 1,
        message: `you are not allowed to ${action} ${subject}`,
      });
    }
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return res.status(200).json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(200).json({
        erros: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    let subjectAddress = subject("DeliveryAddress", {
      ...address,
      user_id: address.user,
    });
    let policy = policyfor(req.user);
    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: `you are not allowed to ${action} ${subject}`,
      });
    }
    address = await DeliveryAddress.findByIdAndDelete(id);
    return res.status(200).json({ status: "success", address });
  } catch (err) {
    next(err);
  }
};

module.exports = { index, store, update, destroy };
