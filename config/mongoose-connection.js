const mongoose = require('mongoose')
const dbgr = require('debug')('development:mongoose')

mongoose
    .connect('mongodb://127.0.0.1:27017/scatch')

    .then(function () {
        dbgr('connected')


    })
    .catch(function (err) {
        dbgr('error: ', err);
    })

module.exports = mongoose.connection





