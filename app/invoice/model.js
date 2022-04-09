const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const invoiceSchema = Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "sub_total harus diisi"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "delivery_fee harus diisi"],
    },
    delivery_address: {
      provinsi: { type: String, require: [true, "provinsi harus diisi."] },
      kabupaten: { type: String, require: [true, "kabupaten harus diisi."] },
      kecamatan: { type: String, require: [true, "kecamatan harus diisi."] },
      kelurahan: { type: String, require: [true, "kelurahan harus diisi."] },
      detail: { type: String },
    },
    total: {
      type: Number,
      required: [true, "total harus diisi"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);
