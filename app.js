import express from "express"
const app = express()
import cors  from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()
//---------------------cron jobs-begin---------------------------------------------
import "./jobs/actionsCrone.js"
import "./jobs/actionsCleaner.js"
//---------------------cron jobs-end-----------------------------------------------

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

export default app
