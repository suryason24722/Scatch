const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const productModel = require("../models/productModel");
const ownerModel = require("../models/ownerModel");

module.exports.registerUser = async function (req, res) {
  try {
    let { fullname, email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) {
      req.flash("error", "You already have an acoount , please login again.");
      return res.redirect("/");
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          // let token = jwt.sign({ email, id: user._id }, "hey i am secret")
          let token = generateToken(user);
          res.cookie("token", token);
          res.send("user created successfully");

          // res.send(user);
        }
      });
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send("Error creating user");
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (!user) {
    req.flash("error", "Invalid user"); // when user is not present
    return res.redirect("/");
  }

  bcrypt.compare(password, user.password, async function (err, result) {
    if (err) return res.status(500).send("Error comparing passwords");
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);

      // Check if the logged-in user is in the ownerModel
      const owner = await ownerModel.findOne({ email: email });

      // Set isAdmin to true if the user exists in the ownerModel
      const isAdmin = !!owner;

      req.session.isAdmin = isAdmin;

      let products = await productModel.find();
      let success = req.flash("success", "Logged in successfully");
      res.redirect("/shop");
      // res.render("shop", { products, success });
    } else {
      req.flash("error", "Invalid  password"); // when user is present but password is invalid
      return res.redirect("/");
    }
  });
};

module.exports.logoutUser = function (req, res) {
  req.flash("error", "Logged out successfully"); // when user is logged out successfully send a flash message
  res.clearCookie("token"); // clear cookie in browser
  res.redirect("/");
};
