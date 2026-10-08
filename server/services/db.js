import mongoose from 'mongoose'

async function connectDB(uri){
    try{
        await mongoose.connect(uri)
        console.log("Підключено до MongoDB")
    } catch (error){
        console.error(
            "Помилка підключення до MongoDB:",
            error.message
        )
        process.exit(1)
    }
}

export default connectDB