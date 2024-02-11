import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import mainRoutes from '../routes/index.routes'
dotenv.config()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended: true, limit: "50mb"}))
app.use(express.json({limit: '50mb'}))
app.use(mainRoutes)
const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log('Server is running!')
})