const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

const PORT = process.env.PORT;

//middlewares
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

//routes
app.use('/api/v1', require('./routes/transactions'))
app.use('/api/v1', require('./routes/auth'))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()