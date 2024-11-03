// process.env.NODE_ENV = "development";
process.env.NODE_ENV = "development";

const express = require("express");
const router = express.Router();
// const router = express();

const ownerModel = require("../models/ownerModel");
const isLoggedIn = require("../middlewares/isLoggedIn");


// console.log(process.env.NODE_ENV);

router.get("/", async (req, res) => {
  res.send("hey its working owner");
});

router.get("/create", function (req, res) {
  res.render("owner-login")
})

if (process.env.NODE_ENV === "development") {


  router.post("/create", async function (req, res) {
    let owners = await ownerModel.find();
    if (owners.length > 0) {
      return res
        .status(500)
        .send("You don't have permission to create a new owner.");
    }
    let { fullname, email, password } = req.body;
    let createdOwner = await ownerModel.create({
      fullname,
      email,
      password,
    });
    res.status(201).send(createdOwner);
  });
}
else {
  router.post("/create", function (req, res) {

    res.send("production environment me owner nahi bana sakte")
  })
}


router.get("/admin", isLoggedIn, async (req, res) => {
  let success = req.flash("success");

  // Check if the logged-in user is in the ownerModel
  const owner = await ownerModel.findOne({ email: req.user.email });

  // Set isAdmin to true if the user exists in the ownerModel
  const isAdmin = !!owner;

  res.render("createproducts", { success, isAdmin });


});

module.exports = router;
