const { initializeApp } = require('firebase/app')
let { getDatabase, ref, get, set } = require('firebase/database')
const express = require('express')

const app = express()

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
const firebaseApp = initializeApp(firebaseConfig); //admin
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebaseApp); //db


const port = 3000
const server = process.env.PORT || 8080 // idk if this matters i see it everywhere tho

app.get('/', (req, res) => {
    res.send('This is our Fashion API!')
})

// Returns JSON (?) of all clothing items for a user
app.get('/:user_id/inventory/:category/:item_id', async (req, res) => {
    try{
        const userId = req.params.user_id; 
        const category = req.params.category;
        const itemId = req.params.item_id;
        const inventoryRef = ref(database, `${userId}/clothing/${category}/${itemId}`);
        const snapshot = await get(inventoryRef);

        if(!snapshot.exists()) {
            return res.status(404).json({ message: 'Inventory not found'});
        }

        res.status(200).json(snapshot.val());
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
