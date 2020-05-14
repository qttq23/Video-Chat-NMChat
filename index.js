
const express = require('express');
const app = express();


// set public static folder
app.use(express.static('public'))

// homepage
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
})



// create http server listen to port
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server is running on: localhost:${port}`);
})
