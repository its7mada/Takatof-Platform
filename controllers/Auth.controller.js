const User = require("../database/user.table");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signUp = async (req, res) => {
  try {
    let {
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      password,
      idNumber,
      city,
      gender,
      state,
    } = req.body;

    if (!state) {
      state = "user";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUser2 = await User.findOne({ idNumber });
    if (existingUser2) {
      return res.status(400).json({ message: "id number already exists" });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.HASH_PASS)
    );

    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      idNumber,
      city,
      gender,
      state,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({ message: "Sign up Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(200).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
        state: foundUser.state,
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1w" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      userData: {
        id: foundUser._id,
        fname: foundUser.firstName,
        mname: foundUser.middleName,
        lname: foundUser.lastName,
        email: foundUser.email,
        state: foundUser.state,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


