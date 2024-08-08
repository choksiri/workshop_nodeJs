var express = require("express");
var router = express.Router();
const productSchema = require("../models/product");
// const { authToken } = require("../middleware/auth")

router.post("/products", async function (req, res) {
  const { name, description, price, inStock } = req.body;

  try {
    // ตรวจสอบว่าผลิตภัณฑ์ที่มีชื่อเดียวกันมีอยู่ในฐานข้อมูลแล้วหรือไม่
    const existingProduct = await productSchema.findOne({ name });
    if (existingProduct) {
      return res.status(409).send("มีสินค้านี้อยู่ในระบบแล้ว");
    }

    // สร้างผลิตภัณฑ์ใหม่
    const newProduct = await productSchema.create({
      name,
      description,
      price,
      inStock,
    });
    res.status(201).send({
      status: "201",
      message: "เพิ่มสินค้าสำเร็จ",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.put("/products/:id", async function (req, res) {
  const { id } = req.params;
  const { name, description, price, inStock } = req.body;
  try {
    const updatedProduct = await productSchema.findByIdAndUpdate(
      id,
      { name, description, price, inStock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    res.status(201).send({
      status: "201",
      message: "แก้ไขสินค้าสำเร็จ",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.delete("/products/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await productSchema.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    res.status(200).send({
      status: "200",
      message: "ลบสินค้า " + deletedProduct.name + " สำเร็จ",
      data: [],
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.get("/products", async function (req, res) {
  try {
    const products = await productSchema.find();
    res.status(200).send({
      status: "200",
      message: "สินค้าทั้งหมด",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

router.get("/products/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const product = await productSchema.findById(id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.status(200).send({
      status: "200",
      message: "สินค้า By Id",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send(error.message || "Internal Server Error");
  }
});

module.exports = router;
