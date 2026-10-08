import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from "./services/db.js"
import productRouter from './routes/productRoutes.js'

dotenv.config()
const app =express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use("/api/products", productRouter)

await connectDB(process.env.MONGO_URI)

app.get('/',(req,res)=>{
    res.send("DM System API працює")
})

app.listen(PORT,()=>{
    console.log(`Сервер запущено на порті ${PORT}`)
})