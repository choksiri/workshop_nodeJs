var express = require("express");
var router = express.Router();
const productSchema = require("../models/product");
const orderSchema = require("../models/order");
// const { authToken } = require("../middleware/auth")

router.post("/products/:id/orders", async function (req, res) {
  const { id } = req.params;
  const { quantity } = req.body;
  console.log(id + quantity);
  try {
    const existingProduct = await productSchema.findById(id);
    if (!existingProduct) {
      return res.status(404).send("ไม่พบสินค้า");
    }

    // ตรวจสอบว่า stock เพียงพอหรือไม่
    if (existingProduct.inStock < quantity) {
      return res.status(400).send("สินค้ามีไม่เพียงพอ");
    }

    // คำนวณยอดรวม
    const totalAmount = existingProduct.price * quantity;

    // สร้างคำสั่งซื้อใหม่
    const newOrder = await orderSchema.create({
      product: id,
      quantity,
      totalAmount,
    });

    // อัปเดต stock ของผลิตภัณฑ์
    existingProduct.inStock -= quantity;
    await existingProduct.save();

    // res.status(201).send(newOrder);
    res.status(201).send({
      status: "201",
      message: "เพิ่มคำสั่งซื้อสำเร็จ",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.get("/products/:id/orders", async function (req, res) {
  const { id } = req.params; // ดึงค่า product ID จาก URL parameters

  try {
    // ตรวจสอบว่ามีผลิตภัณฑ์อยู่ในฐานข้อมูลหรือไม่
    const existingProduct = await productSchema.findById(id);
    if (!existingProduct) {
      return res.status(404).send("Product not found.");
    }

    // ดึงคำสั่งซื้อทั้งหมดที่เชื่อมโยงกับผลิตภัณฑ์ที่ระบุ
    // const orders = await orderSchema.find({ product: id }).populate('product');

    // ดึงคำสั่งซื้อทั้งหมดที่เชื่อมโยงกับผลิตภัณฑ์ที่ระบุ
    const orders = await orderSchema
      .find({ product: id })
      .select(" quantity totalAmount createdAt"); // เลือกเฉพาะฟิลด์ที่ต้องการแสดง
    // .populate('product', 'name'); // populate เฉพาะฟิลด์ name ของ product

    // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
    if (orders.length === 0) {
      return res.status(200).send("No orders found for this product.");
    }

    // res.send(orders);
    res.status(200).send({
      status: "200",
      message: "คำสั่งซื้อทั้งหมดของสินค้า" + existingProduct.name,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.get("/orders", async function (req, res) {
  try {
    const orders = await orderSchema.find();
    // res.send(orders);
    res.status(200).send({
      status: "200",
      message: "คำสั่งซื้อทั้งหมด",
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

module.exports = router;
