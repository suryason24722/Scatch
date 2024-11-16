const config = require('config')

process.env.DEBUG = 'development:mongoose';
const dbgr = require("debug")("development:mongoose")

const AtlasDB_URI = process.env.AtlasDB_URI

const mongoose = require('mongoose')
mongoose
    .connect(`${config.get("AtlasDB_URI")}`)

    .then(function () {


        dbgr('connected') // This will log if DEBUG=development:mongoose is set


    })
    .catch(function (err) {
        dbgr(err);
    })
module.exports = mongoose.connection







