var express = require("express");
var router = express.Router();
const userSchema = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { authToken } = require("../middleware/auth")

router.post("/register", async function (req, res, next) {
  const { name, password } = req.body;

  try {
    const newUser = await userSchema.create({
      name,
      password: await bcrypt.hash(password, 10),
    });
    res.status(201).send({
      status: "201",
      message: "Create success",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const { name, password } = req.body;

    let user = await userSchema.findOne({ name });
    if (!user) {
      return res.status(400).send("ไม่พบผู้ใช้งาน");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }
    if (!user.is_approve) {
      return res.status(401).json({ message: "ผู้ใช้ยังไม่ได้รับการยืนยัน" });
    }

    const { password: pwd, ...userWithoutPassword } = user._doc;

    let userWithIsMatch = {
      ...userWithoutPassword,
      isMatch,
    };
    let token = await jwt.sign(userWithIsMatch, process.env.KEY_TOKEN);
    res.status(201).send({
      status: "201",
      message: "เข้าสู่ระบบสำเร็จ",
      data:  token
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/approve/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      id,
      { is_approve: true },
      { new: true } // ส่งกลับเอกสารที่ถูกอัปเดต
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(201).send({
      status: "201",
      message: "ยืนยันผู้ใช้สำเร็จ",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

module.exports = router;
