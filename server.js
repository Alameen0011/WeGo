import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authRoute from './routes/authRoutes.js';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'


//config dot

dotenv.config();

//db connection
connectDB()


//rest object
const app = express()

//middleware
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes)



//rest api formation

app.get('/',(req,res)=>{
    res.send("<h1>WELLCome to the world of MERN</h1>")
})

//PORT Formation
const PORT  =  process.env.PORT || 8000


app.listen(PORT,()=>{

    console.log(`SERVER started the ${process.env.DEV_MODE}  on Port ${PORT}`  )

})
