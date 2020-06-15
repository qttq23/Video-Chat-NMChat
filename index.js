
const express = require('express');
const expSession = require('express-session');
var exphbs = require('express-handlebars');

const http = require('http');
const socketIO = require('socket.io');

const fileUpload = require('express-fileupload');

// create express app
const app = express();

// create http server listen to port
const server = http.Server(app);
server.listen(process.env.PORT || 3000);

// create socket.io server on same port as http
global.io = socketIO(server);
global.PUBLIC_PATH = `${__dirname}/public`;


// view content of POST message
app.use(express.urlencoded({
    extended: true
})
);

// receive file upload
app.use(fileUpload({
    createParentPath: true,
    // limits: { fileSize: 50 * 1024 * 1024 },
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
const authenRouter = require('./routes/authen-router');
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

        res.locals.isLogin = req.session.isLogin;
        res.locals.account = req.session.account;
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

    let msg = req.session.pendingMsg;
    req.session.pendingMsg = null;
    res.render('homepage/index', {
        isLogin: req.session.isLogin,
        account: req.session.account,
        msg: msg
    });
    
});

app.get('/unknown', function(req, res){

    let state = req.query.state;
    if(state === 'kicked'){
        req.session.pendingMsg = 'host kicked you out';
    }
    else if(state === 'roomfinished'){
        req.session.pendingMsg = 'room was finished by host';
    }
    res.redirect('/home');

});

// user profile
const userRouter = require('./routes/user-router');
app.use('/user', userRouter);


// room router
const roomRouter = require('./routes/room-router');
app.use('/room', roomRouter);


// join/leave history
const db = require('./utils/database.util');
const historyModel = require('./models/join_history.model');
const roomModel = require('./models/room.model');
app.get('/history', async function(req, res){
    // const result = await historyModel.all(req.session.account.UserId);

    res.render('history/history', {
        // list: result
    });
});

app.get('/history/all', async function(req, res){

    console.log('get /history/all');

    let result = await historyModel.get_user_by_id(req.session.account.UserID);
    console.log(result);

    let histories = [];
    // histories = result;

    for(i = 0; i < result.length; i++){
        // let room = await roomModel.get_room_by_id(result[i].RoomID);
        let room = await db.query(`select * from rooms where RoomID="${result[i].RoomID}"`);
        console.log(room);
        room = room[0];

        let host = await userModel.get_user_by_id(room.HostID);
        // let host = await db.query(room.HostID);
        console.log(host);
        host = host[0];

        let history = {
            joinTime: result[i].JoinTime,
            leaveTime: result[i].LeaveTime,
            roomName: room.RoomName,
            hostName: host.Email
        };
        console.log(history);
        histories.push(history);
    }

    res.json({
        histories: histories
    });

});

app.get('/friend', async function (req, res) {
    // const result = await historyModel.all(req.session.account.UserId);

    res.render('add_friend/add_friend', {
        // list: result
    });
});

const friendModel = require('./models/user_friend.model');
const userModel = require('./models/user.model');
app.post('/friend/add', async function(req, res){

    console.log('post /friend/add');
    console.log(req.body);
    const userId = req.session.account.UserID;
    const friendEmail = req.body.friendEmail;

    // check if friend exists
    let friend = await require('./models/user.model').get_user_by_email(friendEmail);
    friend = friend[0];
    console.log(friend);
    if(!friend || friend.UserID === userId){
        res.json({
            result: false,
            msg: 'friend not exists'
        });
    }

    // save database
    const result = await friendModel.add(userId, friend.UserID);
    console.log(result);
    if(result.affectedRows == 1){

        res.json({
            result: true,
            msg: 'add ok'
        });
    }
    else{
        res.json({
            result: false,
            msg: 'add friend failed'
        });
    }


});

app.get('/friend/all', async function(req, res){

    console.log('get /friend/all');
    
    let userId = req.session.account.UserID;
    let result = await friendModel.get_friend_by_id(userId);
    console.log(result);
    
    let friends = result[0];
    let friendsToSend = [];
    for(i = 0; i < friends.length; i++){
        let friend = await userModel.get_user_by_id(friends[i].userId);
        friend = {
            id: friend[0].UserID,
            email: friend[0].Email,
            name: friend[0].Name
        }
        friendsToSend.push(friend);
    }
    console.log(friendsToSend);

    res.json({
        friends: friendsToSend
    });
});