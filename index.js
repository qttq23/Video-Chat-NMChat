
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
    res.render('homepage/index', {
        isLogin: req.session.isLogin,
        account: req.session.account
    });
});


// user profile
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// room
const roomManager = require('./utils/room-manager');
roomManager.startSocketIO();

app.post('/room/create', function(req, res){

    console.log('post /room/create');
    console.log(req.session.account);
    console.log(req.body.roomName);

    const roomName = req.body.roomName;
    const host = req.session.account;

    // check restricts...
    if (req.session.isAlreadyInRoom === true) {
        res.json({
            result: false,
            msg: 'You are already in one room. leave room to create another room.'
        });
        return;
    }
    


    if(roomManager.canCreate(roomName)){
        roomManager.create(roomName, host);
        // res.redirect('/room?id=' + roomName);
        res.json({
            result: true,
            redirect: '/room?id=' + roomName
        });
    }
    else{
        res.json({
            result: false,
            msg: 'cannot create room'
        });
    }
});

// app.post('/room/join', function (req, res) {

//     console.log('post /room/join');
//     console.log(req.session.account);
//     console.log(req.body.roomName);

//     const roomName = req.body.roomName;
//     const client = req.session.account;
//     if (roomManager.canJoin(roomName)) {
//         roomManager.join(roomName, account);
//         res.redirect('/room?id=' + roomName);
//     }
//     else {
//         res.json({
//             result: false,
//             message: 'cannot join room'
//         });
//     }
// });

app.get('/room', function(req, res){

    console.log('get room: ' + req.query.id);

    // check restricts...
    // if(req.session.isAlreadyInRoom === true){
    //     res.end('You are already in one room. leave room to join another room.');
    //     return;
    // }
    
    var roomInfo = roomManager.getRoomInfo(req.query.id);
    console.log(roomInfo);
    if(!roomInfo){
        res.end('Room not found');
        return;
    }
    
    
    // go to room
    req.session.isAlreadyInRoom = true;
    var isHost = false;
    if(roomInfo.host.Email === req.session.account.Email){
        isHost = true
    }
    
    res.render('room/room',{
        roomInfo: roomInfo,
        isHost: isHost,
        userId: req.session.account.Email
    });
});

app.post('/room/leave', function(req, res){
    console.log('leave room: ' + req.body.id);

    req.session.isAlreadyInRoom = false;
    res.json({result: true});
})





// create http server listen to port
// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//     console.log(`Server is running on: localhost:${port}`);
// });
