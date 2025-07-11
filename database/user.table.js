const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ordersAccepted: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[0-9]+$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! Only digits are allowed.`,
      },
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    avatar: {
      data: Buffer,
      contentType: String,
    },
    state: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
