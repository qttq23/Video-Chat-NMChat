
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
    res.render('homepage/index', {
        isLogin: req.session.isLogin,
        account: req.session.account
    });
});


// user profile
const userRouter = require('./routes/user-router');
app.use('/user', userRouter);


// room router
const roomRouter = require('./routes/room-router');
app.use('/room', roomRouter);



// create http server listen to port
// const port = process.env.PORT || 3000;
// app.listen(port, function () {
//     console.log(`Server is running on: localhost:${port}`);
// });
