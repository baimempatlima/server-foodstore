const { subject } = require("@casl/ability");
const Invoice = require("./model");
const { policyFor } = require("../../utils");

const show = async (req, res, next) => {
  try {
    let { order_id } = req.params;
    // let invoice = await Invoice.findOne({ order: order_id });
    let invoice = await Invoice.findOne({ order: order_id }).populate("order").populate("user");
    let policy = policyFor(req.user);
    let subjectInvoice = subject("Invoice", {
      ...invoice,
      user_id: invoice.user._id,
    });
    if (!policy.can("read", subjectInvoice)) {
      return res.json({
        error: 1,
        message: "anda tidak memiliki akses untuk melihat invoice ini",
      });
    }
    // invoice = await Invoice.find({ order: order_id }).populate("order").populate("user");
    return res.json(invoice);
  } catch (err) {
    return res.json({
      error: 1,
      message: "Error when getting invoice",
    });
  }
};

// const show = async (req, res, next) => {
//   try {
//     let policy = policyFor(req.user);
//     let subjectInvoice = subject("Invoice", { ...invoice, user_id: invoice.user._id });
//     if (!policy.can("read", subjectInvoice)) {
//       return res.json({
//         error: 1,
//         message: `Anda tidak memiliki akses untuk melihat invoice ini`,
//       });
//     }
//     let { order_id } = req.params;
//     let invoice = await Invoice.findOne({ order: order_id }).populate("order").populate("user");
//     return res.json(invoice);
//   } catch (error) {
//     return res.json({
//       error: 1,
//       message: `Error when getting invoice`,
//     });
//   }
// };

// const index = async (req, res, next) => {
//   try {
//     let user = req.user;
//     let invoice = await Invoice.find().populate("order").populate("user");
//     if (user.role === "user") {
//       invoice = await Invoice.find({ user: user._id }).populate("order").populate("user");
//     }
//     return res.json(invoice);
//   } catch (err) {
//     return res.json({
//       error: 1,
//       message: "Error when getting invoice",
//     });
//     next();
//   }
// };

module.exports = {
  show,
};
