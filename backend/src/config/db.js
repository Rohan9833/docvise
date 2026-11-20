import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  mongoose.set('sanitizeFilter', true); // neutralises query-selector injection in filters
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[db] connected to ${mongoose.connection.name}`);
  return mongoose.connection;
}

export const disconnectDB = () => mongoose.disconnect();
