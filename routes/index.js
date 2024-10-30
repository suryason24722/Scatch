const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const ownerModel = require("../models/ownerModel");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
  let products = await productModel.find();
  let success = req.flash("success");
  const isAdmin = req.session.isAdmin || false; // Default to false if not set
  res.render("shop", { products, success, isAdmin });
});

router.get("/cart", isLoggedIn, async function (req, res) {
  let user = await userModel
    .findOne({ email: req.user.email })
    .populate("cart");


  if (user.cart.length < 1) {
    res.send("Your cart is empty")
    return;
  }

  const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);

  // Check if the logged-in user is in the ownerModel
  const owner = await ownerModel.findOne({ email: req.user.email });

  // Set isAdmin to true if the user exists in the ownerModel
  const isAdmin = !!owner;

  res.render("cart", { user, bill, isAdmin});

});

router.get("/addtocart/:productId", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productId);
  await user.save();
  req.flash("success", "Product added to cart");
  res.redirect("/shop");
});

module.exports = router;
