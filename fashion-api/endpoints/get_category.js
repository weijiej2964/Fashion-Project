let { getDatabase, ref, get, set } = require('firebase/database')
const express = require('express')
let { connectFirebase } = require('../config/connect_firebase.js')

const get_category = express.Router();

get_category.use(express.json()) // sends json data to PostMan

// Initialize Firebase
connectFirebase()
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(); //db

// Returns JSON (?) of all clothing items for a user
get_category.get('/:user_id/inventory/:category', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const category = req.params.category;
        const inventoryRef = ref(database, `${userId}/clothing/${category}`);
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

module.exports = get_category
