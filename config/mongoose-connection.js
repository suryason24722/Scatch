const config = require('config')

process.env.DEBUG = 'development:mongoose';
const dbgr = require("debug")("development:mongoose")

const mongoose = require('mongoose')
mongoose
    .connect(`${config.get("MONGODB_URI")}`)

    .then(function () {


        dbgr('connected') // This will log if DEBUG=development:mongoose is set


    })
    .catch(function (err) {
        dbgr(err);
    })
module.exports = mongoose.connection







