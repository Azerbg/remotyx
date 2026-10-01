import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getDb() {
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  const client = await global._mongoClientPromise;
  return client.db(process.env.MONGODB_DB || "remotyx");
}
