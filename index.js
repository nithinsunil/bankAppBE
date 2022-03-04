// import express
const express = require('express')

// import dataservice
const dataService = require('./services/data.service')

// import jsonwebtoken
const jwt = require('jsonwebtoken')

// import cors (for connecting localhost 4200 & 3000)
const cors = require('cors')

// create an app using express
const app = express()

// to use cors set origin
app.use(cors({
    origin: 'http://localhost:4200'
}))

// to parse json
app.use(express.json())

// application specific middleware
const logMiddleware = (req, res, next) => {
    console.log("Middleware");
    next()
}
app.use(logMiddleware)

// to resolve http request

// GET - to fetch data
app.get('/', (req, res) => {   // here '/' is the path (localhost:3000)
    res.send("GET METHOD")  // res stands for response, send means to send to the client
});

// POST - to create data
app.post('/', (req, res) => {
    res.send("POST METHOD")
});

// PUT - to modify/update completely data
app.put('/', (req, res) => {
    res.send("PUT METHOD")
});

// PATCH - to modify/update partially data
app.patch('/', (req, res) => {
    res.send("PATCH METHOD")
});

// DELETE - to delete data
app.delete('/', (req, res) => {
    res.send("DELETE METHOD")
});

// JWT middleware - to verify token
const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.headers["x-access-token"]
        const data = jwt.verify(token, 'supersecretkey123456')
        req.currentAcc = data.currentAcc
        next()
    }
    catch {
        res.status(422).json({
            statusCode: 422,
            status: false,
            message: "Please Login"
        })
    }
}

// register API
app.post('/register', (req, res) => {
    // asynchronous
    dataService.register(req.body.acno, req.body.uname, req.body.pwd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// login API
app.post('/login', (req, res) => {

    dataService.login(req.body.acno, req.body.pwd)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// deposit API
app.post('/deposit', jwtMiddleware, (req, res) => {
    dataService.deposit(req.body.acno, req.body.pwd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// withdraw API
app.post('/withdraw', jwtMiddleware, (req, res) => {
    dataService.withdraw(req, req.body.acno, req.body.pwd, req.body.amt)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})


// transaction API
app.post('/transaction', jwtMiddleware, (req, res) => {
    dataService.getTransaction(req.body.acno)
        .then(result => {
            res.status(result.statusCode).json(result)
        })
})

// deleteAcc API
app.delete('/deleteAcc/:acno', (req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

// set port for server
app.listen(3000, () => {
    console.log("server started at port number: 3000");
})