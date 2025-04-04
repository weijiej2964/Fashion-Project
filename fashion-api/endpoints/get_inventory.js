let { getDatabase, ref, get, set } = require('firebase/database')
const express = require('express')
let { connectFirebase } = require('../config/connect_firebase.js')
const cors = require('cors');

const get_inventory = express.Router();

get_inventory.use(express.json()) // sends json data to PostMan
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true // Allow cookies and authentication
}))

app.use(express.json()) // sends json data to PostMan

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAq7_H5i_ojYQAVYVNAG8usMun5YRX0vUY",
    authDomain: "fashion-project-e2aba.firebaseapp.com",
    databaseURL: "https://fashion-project-e2aba-default-rtdb.firebaseio.com",
    projectId: "fashion-project-e2aba",
    storageBucket: "fashion-project-e2aba.firebasestorage.app",
    messagingSenderId: "156468025393",
    appId: "1:156468025393:web:72f80e880c47dca37f5d10"
};

// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(); //db

// Returns JSON (?) of all clothing items for a user
get_inventory.get('/:user_id/inventory', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const inventoryRef = ref(database, `${userId}/clothing/`);
        const snapshot = await get(inventoryRef);

        if (!snapshot.exists()) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.status(200).json(snapshot.val());
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = get_inventory