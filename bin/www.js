#!/usr/bin/env node
/* Module dependencies.*/
import dotenv from "dotenv"
dotenv.config()
import http from "node:http"
import mongoose from "mongoose"
import { log } from "../components/logger.js" 
import app from "../app.js"
import moment from "moment"
import createDebug from "debug"
const debug =createDebug("api:server")

// Export the mongoose connection
export { mongoose }

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO)
    console.log("Connected to mongoDB")
  } catch (error) {
    console.log("Connection failed")
    throw error
  }
}
mongoose.connection.on("disconnected", ()=> {
  console.log("mongoDB disconnected")
})

try {
  /* Get port from environment and store in Express.*/
 const port = normalizePort(process.env.PORT || "3001")
 app.set("port", port)
 
 /* Create HTTP server.*/
  const server = http.createServer(app)
  
  /* Normalize a port into a number, string, or false.*/  
  function normalizePort(val) {
    const port = parseInt(val, 10)
  
    if (isNaN(port)) {
      // named pipe
      return val
    }
  
    if (port >= 0) {
      // port number
      return port
    }
  
    return false
  }

  /* Listen on provided port, on all network interfaces.*/  
  server.listen(port,()=>{
    connect()
    console.log(`Server is running on port ${port}`)
  })
  server.on("error", onError)
  server.on("listening", onListening)

  /* Event listener for HTTP server "error" event.*/
  
  function onError(error) {
    if (error.syscall !== "listen") {
      throw error
    }
  
    const bind = typeof port === "string"
      ? "Pipe " + port
      : "Port " + port
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges")
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(bind + " is already in use")
        process.exit(1)
        break
      default:
        throw error
    }
  }

  /* Event listener for HTTP server "listening" event.*/  
  function onListening() {
    const addr = server.address()
    const bind = typeof addr === "string"
      ? "pipe " + addr
      : "port " + addr.port
    debug("Listening on " + bind)
  }

} catch (error) {
  console.error(error)
  setTimeout(() => {
    log.error(
      moment().format("yyyy_MM_DD-HH:mm:ss") + "\n" + error.stack + "\n\n"
    )
  }, 1000)
}




