const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./config/database')
const authenticateUser = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const sslRedirect = require('heroku-ssl-redirect').default

//Routes
const authRoute = require('./Routes/auth')
const linkRoute = require('./Routes/links')

//middlewares

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
//     next()
// })
app.use(cors({
    origin: 'https://linkpath-josephn.vercel.app',
    methods: 'POST, GET, PATCH, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    
}))
app.use(sslRedirect())
app.use(errorHandler)
app.use(express.json())

const port = process.env.PORT || 5000
dotenv.config()
const source = process.env.MONGO_URI



app.use('/api/v1/auth',  authRoute)
app.use('/api/v1/links',  authenticateUser, linkRoute)
app.get('/', (req, res)=>{
    res.send("home")
 })
const start = async () =>{
    try {
        
      connectDb(source, console.log("server loaded"))
      app.listen(port, console.log(`server is running at ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
