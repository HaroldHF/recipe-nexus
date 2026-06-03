import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI as string;
  await mongoose.connect(uri);
  console.log("✅ MongoDB conectado");
}
