const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

let userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "nama harus diisi "],
      maxlength: [255, "Panjang nama harus antara 3 - 255 karakter"],
      minlength: [3, "Panjang nama harus antara 3 - 255 karakter"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email harus diisi"],
      maxlength: [255, "Panjang email maksimal 255 karakter"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      maxlength: [255, "Panjang password maksimal 255 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

//menambahkan validasi email baru -regexemailvalidator
userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

//validasi pengecekan email apakah sudah terdaftar atau tidak
userSchema.path("email").validate(
  async function (value) {
    try {
      //lakukan pencaharian  ke collection user berdasarkan "email"
      const count = await this.model("User").count({ email: value });

      //kode ini mengidentifikasi bahwa jika user ditemukan akan mengembalikan  'false' jika tidak ditemukan mengembalikan true
      //jika 'false' maka validasi gagal/
      //jika 'true' maka validasi berhasil/mengembalikan nilai 1 atau ketemu
      return !count;
    } catch (error) {
      throw error;
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
);

// hashing password //npm install bcrypt
const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

//mengaktifkan auto increment pada customer_id //npm i mongoose-sequence
userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });
module.exports = model("User", userSchema);
