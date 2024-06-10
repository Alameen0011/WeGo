import mongoose from "mongoose"



const connectDB = async ()=>{
    try {
         const conn = await mongoose.connect(process.env.MONGO_URL)
         console.log(`DB connected  ${conn.connection.host}`)
        
    } catch (error) {
        console.log("Data base connection error"+error)
        
    }
}

export default connectDB