import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Already Connected to DB");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {
      maxPoolSize: 10,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000, // Avoid timeouts
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB:", db.connections[0].name);
  } catch (error: any) {
    console.error("Database connection failed:", error.message || error);
    throw new Error("Database connection failed");
  }
};

export default dbConnect;
