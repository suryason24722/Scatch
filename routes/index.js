const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");
const ownerModel = require("../models/ownerModel");

const upload = require("../config/multer-config");

// Middleware to set isAdmin for all routes
router.use(async (req, res, next) => {
  if (req.user) {
    const owner = await ownerModel.findOne({ email: req.user.email });
    req.session.isAdmin = !!owner; // Save in session for consistency
  }
  next();
});


router.get("/", async function (req, res) {

  let error = req.flash("error");

  // This will not work because we cannot use isLoggedIn midddleware on / route otherwise it will not display after logout
  // let user = await userModel.findOne({ email: req.user.email })

  // Check if the logged-in user is in the ownerModel
  // const owner = await ownerModel.findOne({ email: req.user.email });

  // Set isAdmin to true if the user exists in the ownerModel
  // const isAdmin = !!owner;

  const isAdmin = req.session.isAdmin || false;

  res.render("index", { error, loggedin: false, isAdmin });
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

  // const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);

  // Initialize the total bill with the platform fee
  let bill = 20;

  // Calculate the total bill using forEach
  user.cart.forEach((item) => {
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    let itemTotal = price - discount;
    bill += itemTotal;

    // console.log(`Price: ${price}, Discount: ${discount}, Item Total: ${itemTotal}, Running Bill: ${bill}`);
  });

  // Check if the logged-in user is in the ownerModel
  const owner = await ownerModel.findOne({ email: req.user.email });

  // Set isAdmin to true if the user exists in the ownerModel
  const isAdmin = !!owner;

  res.render("cart", { user, isAdmin, bill });

});

router.get("/addtocart/:productId", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productId);
  await user.save();
  req.flash("success", "Product added to cart");
  res.redirect("/shop");
});


router.get('/profile', isLoggedIn, async function (req, res) {
  // res.send(req.user)

  let user = await userModel.findOne({ email: req.user.email })
  // console.log(user);

  res.render('user_profile', { user })

})

router.get('/profile/upload', function (req, res) {
  res.render('profile_upload')
})

router.post('/upload', isLoggedIn, upload.single('image'), async function (req, res) {
  // console.log(req.file);
  let user = await userModel.findOne({ email: req.user.email })
  user.profilepic = req.file.buffer
  await user.save()
  res.redirect('/profile')


})

router.post("/update/:id", async (req, res) => {
  let { fullname, email, contact } = req.body
  let updatedUser = await userModel.findOneAndUpdate({ _id: req.params.id }, { fullname, email, contact }, { new: true })
  // console.log(updatedUser);

  res.redirect('/profile')
})

module.exports = router;
