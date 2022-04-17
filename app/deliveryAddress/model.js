const { model, Schema } = require("mongoose");

const deliveryAddressSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nama alamat harus di isi"],
      maxlength: [255, "panjang maksimal nama 255 karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "kelurahan alamat harus di isi"],
      maxlength: [255, "panjang maksimal kelurahan 255 karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "kecamatan alamat harus di isi"],
      maxlength: [255, "panjang maksimal kecamatan 255 karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "kabupaten alamat harus di isi"],
      maxlength: [255, "panjang maksimal kabupaten 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "provinsi alamat harus di isi"],
      maxlength: [255, "panjang maksimal provinsi 255 karakter"],
    },
    detail: {
      type: String,
      required: [true, "detail alamat harus di isi"],
      maxlength: [1000, "panjang maksimal detail 1000 karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);
