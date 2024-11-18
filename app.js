const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const path = require("path");

// const upload = require("../config/multer-config");
//"MONGODB_URI":"mongodb://127.0.0.1:27017/scatch"


// process.env.NODE_ENV = "development";

require('dotenv').config();
// console.log('NODE_ENV:', process.env.NODE_ENV);


const db = require("./config/mongoose-connection")


const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const index = require('./routes/index');
const expressSession = require('express-session');

const flash = require('connect-flash');

require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());



app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: 'process.env.EXPRESS_SESSION_SECRET'
    })
)
app.use(flash());



app.set("view engine", "ejs");

app.use('/owners', ownersRouter)
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/', index)


app.listen(3000, (req, res) => {
    console.log("Server is running on port 3000");
});