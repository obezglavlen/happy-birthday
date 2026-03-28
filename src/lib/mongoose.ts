import mongoose from "mongoose";

const globalWithMongoose = globalThis as typeof globalThis & {
  __mongoosePromise?: Promise<typeof mongoose>;
};

export async function initMongoose() {
  if (globalWithMongoose.__mongoosePromise) {
    return globalWithMongoose.__mongoosePromise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI не задан");
  }

  globalWithMongoose.__mongoosePromise = mongoose.connect(uri, {
    dbName: process.env.MONGODB_DBNAME,
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  });

  return globalWithMongoose.__mongoosePromise;
}
