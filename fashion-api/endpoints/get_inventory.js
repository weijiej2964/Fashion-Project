let { getDatabase, ref, get, set } = require('firebase/database')
const express = require('express')
let { connectFirebase } = require('../config/connect_firebase.js')
// const cors = require('cors');

const get_inventory = express.Router();

get_inventory.use(express.json()) // sends json data to PostMan

// get_inventory.use(cors({
//     origin: 'http://localhost:4200',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
//     credentials: true // Allow cookies and authentication
// }))

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