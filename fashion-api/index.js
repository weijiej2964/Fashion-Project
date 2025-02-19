// this is the main file for the api love and kisses

/*
TO DO:
- connect with db
- make endpoints
*/

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


// endpoint to add to db
// endpoint to get from db
