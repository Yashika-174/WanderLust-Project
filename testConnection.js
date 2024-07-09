const mongoose = require('mongoose');
require('dotenv').config();

const db_url = process.env.ATLASDB_URL;

async function testConnection() {
    try {
        await mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds
        });
        console.log("Connection Successful with MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

testConnection();


const ATLASDB_URL = "mongodb+srv://Yashika_174:3dPikehPalGvtpgP@cluster0.j79dm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


