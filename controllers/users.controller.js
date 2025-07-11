const bcrypt = require("bcrypt");
const Users = require("../database/user.table");
const { uploadUserAvatarImage } = require("../middleware/multerConfig");

const changePassword = async (req, res) => {
  try {
    const { id } = req.params; // Corrected this line
    const { oldPassword, newPassword } = req.body;

    console.log(id, oldPassword, newPassword);

    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.HASH_PASS)
    );
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  uploadUserAvatarImage(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: `Image upload error: ${err.message}` });
    }

    try {
      const id = req.params.id;
      const { firstName, middleName, lastName, phoneNumber, city, gender } =
        req.body;

      if (!firstName || !lastName || !phoneNumber) {
        return res.status(400).json({
          message: "First name, last name, email, and phone are required.",
        });
      }

      const profileImage = req.file ? req.file.filename : null;
      console.log(req.file);
      const userId = id;
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      user.firstName = firstName;
      user.middleName = middleName || user.middleName;
      user.lastName = lastName;
      user.phoneNumber = phoneNumber;
      user.city = city || user.city;
      user.gender = gender || user.gender;
      if (profileImage) {
        user.avatar = profileImage;
      }

      await user.save();

      res.status(200).json({ message: "Profile updated successfully.", user });
    } catch (error) {
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  });
};

const gitUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const gitUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const gitUsersCount = async (req, res) => {
  try {
    const count = await Users.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { blocked: !user.blocked },
      { new: true }
    );

    const message = updatedUser.blocked ? "User blocked" : "User unblocked";
    res.status(200).json({ message, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const toggleUserState = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const newState = user.state === "admin" ? "user" : "admin";
    const updatedUser = await Users.findByIdAndUpdate(
      id,
      { state: newState },
      { new: true }
    );

    const message =
      newState === "admin" ? "User promoted to admin" : "Admin demoted to user";
    res.status(200).json({ message, user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  changePassword,
  updateProfile,
  gitUsers,
  gitUserById,
  gitUsersCount,
  toggleUserState,
  toggleBlockUser,
};
