const { initializeApp } = require('firebase/app')
let { getDatabase, ref, set } = require('firebase/database')

const express = require('express')
const app = express()
const firebase = require('firebase/app')

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
firebase.initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase();


const port = 3000
const server = process.env.PORT || 8080 // idk if this matters i see it everywhere tho


// stuff that comes with express brah
app.get('/', (req, res) => {
    res.send('This is our Fashion API!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Returns JSON (?) of clothing of a specific category
app.get('/:user_id/inventory/category', async (req, res) => {
    res.send('GET request to get clothing')


})