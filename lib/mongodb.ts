
import { MongoClient } from "mongodb"

let client
let clientPromise: Promise<MongoClient>

const uri = process.env.MONGODB_URI
const options = {}

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
} else {
  // During build time or when MONGODB_URI is not set, avoid throwing at import time.
  // Instead, return a rejected promise that fails only when awaited.
  const errPromise = Promise.reject(
    new Error('Invalid/Missing environment variable: "MONGODB_URI"')
  )
  errPromise.catch(() => {})
  clientPromise = errPromise
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
