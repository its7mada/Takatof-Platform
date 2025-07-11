const express = require("express");
const router = express.Router();
const auth = require("../controllers/Auth.controller");

router.post("/signUp", auth.signUp);
router.post("/logIn", auth.logIn);
module.exports = router;
