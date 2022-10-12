const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDb = require('./config/database')
const authenticateUser = require('./middleware/authentication')
const errorHandler = require('./middleware/errorHandler')
const cors = require('cors')


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const port = process.env.PORT || 5000
dotenv.config()
const source = process.env.MONGO_URI
//Routes
const authRoute = require('./Routes/auth')
const linkRoute = require('./Routes/links')

//errors handlers
app.use(errorHandler)

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(cors(corsOptions))

app.use('/api/v1/auth', authRoute)
app.use('/api/v1/links',  authenticateUser, linkRoute)
app.get('/', (req, res)=>{
    res.send("home")
 })
const start = async () =>{
    try {
        
      await  connectDb(source, console.log("server loaded"))
      app.listen(port, console.log(`server is running at ${port}...`))
    } catch (error) {
        console.log(error)
    }
}

start()
