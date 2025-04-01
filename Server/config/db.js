import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // La URL de conexión puede estar en tu archivo .env
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/sportpronos";
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;