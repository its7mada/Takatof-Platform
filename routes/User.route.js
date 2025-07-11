const express = require("express");
const {
  changePassword,
  gitUsers,
  gitUsersCount,
  gitUserById,
  updateProfile,
  toggleBlockUser,
  toggleUserState,
} = require("../controllers/users.controller");
const router = express.Router();

router.post("/changePassword/:id", changePassword);
router.get("/", gitUsers);
router.get("/count", gitUsersCount);
router.get("/:id", gitUserById);
router.put("/:id", updateProfile);
router.patch("/toAdmin/:id", toggleUserState);
router.patch("/blockUser/:id", toggleBlockUser);

module.exports = router;
