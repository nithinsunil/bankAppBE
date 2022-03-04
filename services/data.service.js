// import jsonwebtoken
const jwt = require('jsonwebtoken')

// import db.js
const db = require('./db')

database = {
  1000: { acno: 1000, uname: "michael", pwd: "1000", balance: 5000, transaction: [] },
  1001: { acno: 1001, uname: "jim", pwd: "1001", balance: 5000, transaction: [] },
  1002: { acno: 1002, uname: "pam", pwd: "1002", balance: 5000, transaction: [] },
  1003: { acno: 1003, uname: "dwight", pwd: "1003", balance: 5000, transaction: [] }
}

// register function
const register = (acno, uname, pwd) => {
  return db.User.findOne({ acno })
    .then(user => {
      console.log(user)
      if (user) {
        return {
          statusCode: 422,
          status: false,
          message: "User already exists, please Login"
        }
      }
      else {
        const newUser = new db.User({
          acno, uname, pwd, balance: 0, transaction: []
        })
        newUser.save()
        return {
          statusCode: 200,
          status: true,
          message: "Successfully registered"
        }
      }
    })
}




// login function
const login = (acno, pwd) => {
  return db.User.findOne({
    acno,
    pwd
  })
    .then(user => {
      if (user) {
        currentUserName = user.uname
        currentAcno = acno

        // token generation
        token = jwt.sign({
          currentAcc: acno
        }, 'supersecretkey123456')

        return {
          statusCode: 200,
          status: true,
          message: "login success",
          currentUserName,
          currentAcno,
          token
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid credentials"
        }
      }
    })

}


// deposit function
const deposit = (acno, pwd, amt) => {
  var amount = parseInt(amt) // converting 'amount' to interger using parseInt(), because data is retrieved from the HTML as string type.

  return db.User.findOne({ acno, pwd })
    .then(user => {
      if (user) {
        user.balance += amount
        user.transaction.push({
          type: "CREDIT",
          amount: amount
        })
        user.save()
        return {
          statusCode: 200,
          status: true,
          message: amount + " deposited successfully.. New balance is " + user.balance
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid credentials"
        }
      }
    })
}


// withdraw function
const withdraw = (req, acno, pwd, amt) => {
  var amount = parseInt(amt)
  currentAcc = req.currentAcc

  return db.User.findOne({ acno, pwd })
    .then(user => {

      // else {
      //   return {
      //     statusCode: 422,
      //     status: false,
      //     message: "Invalid credentials"

      //   }
      // }
      if (user) {
        if (currentAcc != acno) {
          return {
            statusCode: 422,
            status: false,
            message: "Operation denied"
          }
        }


        if (user.balance > amount) { // checking if account have enough balance
          user.balance -= amount
          user.transaction.push({ // adding transaction details
            type: "DEBIT",
            amount: amount
          })
          user.save()
          return {
            statusCode: 200,
            status: true,
            message: amount + " withdrawed successfully.. New balance is " + user.balance
          }
        }
        else {
          return {
            statusCode: 422,
            status: false,
            message: "Insufficient balance"
          }
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Operation denied"
        }
      }
    })
}

const getTransaction = (acno) => {

  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 200,
          status: true,
          transaction: user.transaction
        }
      }
      else {
        return {
          statusCode: 422,
          status: false,
          message: "Invalid account number"

        }
      }
    })
}

const deleteAcc = (acno)=>{
  return db.User.deleteOne({
    acno
  })
  .then(user=>{
    if(user){
      return{
        statusCode: 200,
        status: true,
        message: "Account deleted successfully"
      }
    }
    else{
      return{
        statusCode: 422,
      status: false,
      message: "Invalid credentials"
      }
    }
  })
}

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTransaction,
  deleteAcc
}