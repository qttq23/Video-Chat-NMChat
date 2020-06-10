
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
const historyModel = require('./models/join_history.model');
app.get('/history', async function(req, res){
    const result = await historyModel.all(req.session.account.UserId);

    res.render('history/history', {
        // list: result
    });
});


// create http server listen to port
// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//     console.log(`Server is running on: localhost:${port}`);
// });
