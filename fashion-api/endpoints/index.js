// this is the main file for the api 
// TO DO: connect with firebase auth to get token to only allow authorized users to make calls

let { getDatabase, ref, set, push } = require('firebase/database')
let { connectFirebase } = require('../config/connect_firebase.js')

const express = require('express')
const app = express()
const router = express.Router();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    credentials: true // Allow cookies and authentication
}))

const get_category = require('./get_category')
const get_clothing = require('./get_clothing')
const get_inventory = require('./get_inventory')
const delete_clothing = require('./delete_clothing')


app.use(express.json()) // sends json data to PostMan
app.use(get_category)
app.use(get_clothing)
app.use(get_inventory)
app.use(delete_clothing)

// Initialize Firebase
connectFirebase()

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

// app.use(cors({
//     origin: 'http://localhost:4200',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
//     credentials: true // Allow cookies and authentication
// }))

// Uploads clothing image and any data associated with it, stores it into the database
// TO DO: Take care of Firebase warning errors
// TO DO: Error handling for things not in the data
// ENHANCEMENTS: add back category error handling...
app.post('/:user_id/inventory/upload', (req, res) => { // does this have to be async? idk lets find out 
    // im not even too sure if this works like this when we do authentication but we move
    const Category = new Set(['top', 'bottom', 'shoes', 'hats', 'glasses', 'earrings', 'necklaces', 'bracelets', 'watches', 'rings', 'accessories', 'outerwear'])


    console.log(`POST request to upload clothes`)
    try {
        item_id = req.body.item_id
        category = (req.body.category).toLowerCase()

        if (!Category.has(category)) {
            // throw new Error("Given category is not valid")
            // callback(res.send(JSON.stringify(Error("Given category is not valid"))))
            // callback((Error("Given category is not valid")))

            // return res.status(400)
            // var err = new Error("Given category is not valid")
            res.status(400).json({ 'Invalid Input': "Given category is not valid" });

        }

        const data = {
            item_name: req.body.item_name,
            item_desc: req.body.item_desc,
            image_url: req.body.image_url,
            image_blob: req.body.image_blob,
            tags: req.body.tags
        };


        // const refPath = "/" + req.params.user_id + "/clothing/" + req.body.category + "/" + item_id + "/"
        const refPath = ref(database, `/${req.params.user_id}/clothing/${category}/`)

        // set(ref(database, refPath), data);
        const item = push(refPath)
        set(item, data)
    }
    catch (err) {
        // res.send({ err: "Upload unsuccessful" })
        res.status(500).json({ 'Internal Server Error': err.message });
        console.log(err.message)

        // next(err)
    }
    res.status(201).send({ message: "Upload successful" })

})

// // Returns JSON (?) of all clothing items for a user
// app.get('/:user_id/inventory/', async (req, res) => {
//     // im not even too sure if this works like this when we do authentication but we move
//     res.send('GET request to get clothing')

//     const user_id = req.params.user_id;
//     const query = db.collection('inventory').where('user_id', '==', user_id) // placeholder for firestore PLEASEEEEE
//     const querySnapshot = await query.get();
//     if (querySnapshot.size > 0) {
//         res.json(querySnapshot.doc[0].data());
//     }
//     else {
//         res.json({ status: "user not found or user has no inventory" })
//     }

//     console.log(`Successfully returned clothes`)
// })

// // Returns JSON of a specific piece of clothing the user has in their inventory
// app.get('/:user_id/inventory/:clothing_id', async (req, res) => {
//     res.send('GET request to get clothing information')

//     const clothing_id = req.params.clothing_id;
//     const query = db.collection('inventory').where('clothing_id', '==', clothing_id) // placeholder for firestore PLEASEEEEE
//     const querySnapshot = await query.get();
//     if (querySnapshot.size > 0) {
//         res.json(querySnapshot.doc[0].data());
//     }
//     else {
//         res.json({ status: "clothing not found" })
//     }

//     console.log(`Successfully returned clothing ite,`)
// })

// // Updates the data of a specific clothing from the user's inventory
// app.put('/:user_id/inventory/:clothing_id', (req, res) => {
//     res.send('PUT request to update clothing information')

//     const clothing_id = req.params.clothing_id;

//     console.log(`Successfully updated clothes`)
// })

// // Deletes the data of a specific clothing from the user's inventory
// app.delete('/:user_id/inventory/:clothing_id', (req, res) => {
//     res.send('DELETE request to delete an item')

//     const clothing_id = req.params.clothing_id;

//     console.log(`Successfully deleted clothes`)
// })

// // Creates an outfit based off the keyword the user sends
// app.post('/:user_id/inventory/shuffle/:keyword', (req, res) => {
//     res.send('POST request to shuffle an outfit')

//     const keyword = req.params.keyword;

//     console.log(`Successfully shuffled clothes`)
// })