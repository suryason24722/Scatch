const express = require("express");
// const router = express();
const router = express.Router();

const productModel = require("../models/productModel");
const upload = require("../config/multer-config");

router.post("/create", upload.single("image"), async function (req, res) {
  // res.send(req.file)
  try {
    let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;
    let createdProduct = await productModel.create({
      image: req.file.buffer,
      price,
      discount,
      name,
      bgcolor,
      panelcolor,
      textcolor,
    });
    req.flash("success", "Product created successfully");
    res.redirect("/owners/admin");
  } catch (error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
