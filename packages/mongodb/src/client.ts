import { MongoClient } from "mongodb"

const globalForMongo = globalThis as unknown as {
  _mongoClient: MongoClient | undefined
}

function createMongoClient(): MongoClient {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI 환경변수가 설정되지 않았습니다")
  }
  return new MongoClient(uri)
}

export const mongoClient =
  globalForMongo._mongoClient ?? createMongoClient()

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = mongoClient
}

export async function getDb(name = "bling") {
  return mongoClient.db(name)
}
