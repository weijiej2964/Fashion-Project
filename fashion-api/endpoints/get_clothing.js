let { getDatabase, ref, get, set } = require('firebase/database')
const express = require('express')
let { connectFirebase } = require('../config/connect_firebase.js')

// const app = express()

const get_clothing = express.Router();

// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(); //db

// Returns JSON (?) of all clothing items for a user
get_clothing.get('/:user_id/inventory/:category/:item_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const category = req.params.category;
        const itemId = req.params.item_id;
        const inventoryRef = ref(database, `${userId}/clothing/${category}/${itemId}`);
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

module.exports = get_clothing