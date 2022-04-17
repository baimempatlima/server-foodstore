const mongoose = require("mongoose");
const { model, Schema } = mongoose;

let tagSchema = new Schema({
  name: {
    type: String,
    minlength: [3, "minimal panjang category 3 karakter"],
    maxlength: [20, "panjang nama kategori maksimal 20 karakter"],
    required: [true, "nama kategori harus diisi"],
  },
});

module.exports = model("Tag", tagSchema);
