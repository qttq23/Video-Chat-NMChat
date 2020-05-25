
const express = require('express');
const expSession = require('express-session');
var exphbs = require('express-handlebars');

const http = require('http');
const socketIO = require('socket.io');

// create express app
const app = express();

// create http server listen to port
const server = http.Server(app);
server.listen(process.env.PORT || 3000);

// create socket.io server on same port as http
global.io = socketIO(server);


// view content of POST message
app.use(express.urlencoded({
    extended: true
})
);


// set handlebars
// app.engine('handlebars', exphbs({
//     defaultLayout: 'main.handlebars',
// })
// );
// app.set('view engine', 'handlebars');
app.engine('html', exphbs({
    defaultLayout: false,
})
);
app.set('view engine', 'html');


// set public static folder
app.use(express.static('public'));
app.use(express.static('.'));

// set session
app.use(expSession(
    {
        secret: 'keyboard cat',
        cookie: { maxAge: 60000 * 600 },
        resave: false,
        saveUninitialized: true,
    })
);



// authen: login, register
const authenRouter = require('./routes/authen');
app.use('/authen', authenRouter);


// app middleware
app.use(async function(req, res, next){

    console.log('entrance');

	if(!req.session.isLogin){
    // if(false){
        console.log('not yet login');

        res.redirect('/authen/login');
    }
    else{
        console.log('already login');
        console.log(req.session.account);
        next();
    }

});


// default get
app.get('/', function(req, res){

    res.redirect('/home');

})

// homepage
app.get('/home', function(req, res){
    // res.sendFile(__dirname + '/index.html');
    res.render('home', {
        isLogin: req.session.isLogin,
        account: req.session.account
    });
});


// room
const roomManager = require('./utils/room-manager');
roomManager.startSocketIO();

app.post('/room/create', function(req, res){

    console.log('post /room/create');
    console.log(req.session.account);
    console.log(req.body.roomName);

    const roomName = req.body.roomName;
    const client = req.session.account;
    if(roomManager.canCreate(roomName)){
        roomManager.create(roomName, account);
        res.redirect('/room?id=' + roomName);
    }
    else{
        res.json({
            result: false,
            message: 'cannot create room'
        });
    }
});

app.post('/room/join', function (req, res) {

    console.log('post /room/join');
    console.log(req.session.account);
    console.log(req.body.roomName);

    const roomName = req.body.roomName;
    const client = req.session.account;
    if (roomManager.canJoin(roomName)) {
        roomManager.join(roomName, account);
        res.redirect('/room?id=' + roomName);
    }
    else {
        res.json({
            result: false,
            message: 'cannot join room'
        });
    }
});

app.get('/room', function(req, res){

    console.log('get room: ' + req.query.id);
    res.render('room',{
        roomName: req.query.id
    });
});





// create http server listen to port
// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//     console.log(`Server is running on: localhost:${port}`);
// });
