const express = require('express');
// const router = express();
const router = express.Router();
const { registerUser,loginUser,logoutUser } = require('../controllers/authController');

router.get('/', function (req, res) {
    res.send("hey it's working user")
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

module.exports = router;
