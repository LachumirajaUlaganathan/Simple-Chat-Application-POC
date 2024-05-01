const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017'; // Replace with your database URI

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log('Connected to MongoDB');

        // You can access your database, collections, and perform operations here
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

// Accessing a specific database
const database = client.db('chatApplicationPOC');

// Accessing a specific collection
const collection = database.collection('userData');

// Insert a document into the collection
//await collection.insertOne({ name: 'John Doe', age: 30 });
//console.log('Document inserted successfully');


connectToDatabase();

module.exports = collection;
