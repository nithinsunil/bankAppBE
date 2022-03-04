// to connect server with mongoDB

// import mongoose
const mongoose = require('mongoose')

// define connection string
mongoose.connect('mongodb://localhost:27017/bankApp', {
    useNewUrlParser: true
})

// to create the model
const User = mongoose.model('User', { // singular version of the collection's name (users => User)
    acno: Number,
    uname: String,
    pwd: String,
    balance: Number,
    transaction: []

})

// export model
module.exports = {
    User
}