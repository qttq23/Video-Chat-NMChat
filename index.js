
const express = require('express');
const expSession = require('express-session');
var exphbs = require('express-handlebars');


const app = express();

// view content of POST message
app.use(express.urlencoded({
    extended: true
})
);


// set handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main.handlebars',
})
);
app.set('view engine', 'handlebars');


// set public static folder
app.use(express.static('public'));

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


// create http server listen to port
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server is running on: localhost:${port}`);
});
