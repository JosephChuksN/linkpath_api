const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const connectDb = require('./config/database')
const authenticateUser = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')
const sslRedirect = require('heroku-ssl-redirect').default

//Routes
const authRoute = require('./Routes/auth')
const linkRoute = require('./Routes/links')
const visitorsRoute = require('./Routes/visitorsRoute')


//middlewares
app.use(cors())
app.use(sslRedirect())
app.use(express.json())
app.use(errorHandler)
app.use(express.static('./'))



//app routes
app.use('/api/v1/auth',  authRoute)
app.use('/api/v1/links',  authenticateUser, linkRoute)
app.use('/api/v1/link', visitorsRoute)
app.get('/', (req, res)=>{
    res.json({})
 })
 
 const port = process.env.PORT || 5000

const start = async () =>{
    try { 
       await connectDb(process.env.MONGO_URI);
      app.listen(port, ()=>{
        console.log(`server is running at ${port}...`)} )
    } catch (error) {
        console.log(error)
    }
}

start()
