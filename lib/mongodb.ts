import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_ATLAS_CLUSTER_URI) {
  throw new Error('Missing MONGODB_ATLAS_CLUSTER_URI');
}

console.log('Initializing MongoDB connection');
let uri = process.env.MONGODB_ATLAS_CLUSTER_URI;

// Ensure the URI includes the database name by adding it if not present
if (!uri.includes('mongodb.net/Chatbot_v2')) {
  console.log('Adding Chatbot_v2 database to MongoDB URI');
  
  // Check if there are query parameters
  if (uri.includes('?')) {
    // Properly insert database name before query parameters
    const [baseUrl, queryParams] = uri.split('?');
    
    // Ensure no trailing slash on the base URL
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // Reconstruct the URI with the database name
    uri = `${cleanBaseUrl}/Chatbot_v2?${queryParams}`;
  } else {
    // No query parameters, append database name
    // Remove trailing slash if present to avoid double slashes
    uri = uri.endsWith('/') ? `${uri.slice(0, -1)}/Chatbot_v2` : `${uri}/Chatbot_v2`;
  }
  
  console.log('Modified URI to include database name');
} else {
  console.log('MongoDB URI already includes database name');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve value across module reloads
  if (!global._mongoClientPromise) {
    console.log('Creating new MongoDB client in development mode');
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect()
      .then(client => {
        console.log('MongoDB connected successfully in development mode');
        return client;
      })
      .catch(error => {
        console.error('MongoDB connection error in development mode:', error);
        throw error;
      });
  } else {
    console.log('Reusing existing MongoDB client in development mode');
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  console.log('Creating new MongoDB client in production mode');
  client = new MongoClient(uri);
  clientPromise = client.connect()
    .then(client => {
      console.log('MongoDB connected successfully in production mode');
      return client;
    })
    .catch(error => {
      console.error('MongoDB connection error in production mode:', error);
      throw error;
    });
}

export default clientPromise;