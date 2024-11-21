import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number
}

const connection : ConnectionObject = {}

//void means farak nhi padta of the return type of promise
async function dbConnect(): Promise<void>{
  if (connection.isConnected){
    console.log("Already Connected to DB");
    return
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '' , {})

    connection.isConnected = db.connections[0].readyState

    console.log("DB Connected SUCCESFULLY")

  } catch (error) {
    console.log("DB connection failed", error)
    process.exit(1)
  }
}

export default dbConnect;