
const express = require('express');

const router = express.Router();
module.exports = router;


// login
router.get('/login', function (req, res) {

    console.log('get login');

    if (!req.session.isLogin) {
        res.render('login/login');

        // req.session.isLogin = true;
        // const account = {
        //     username: ''+ Math.random(),
        //     password: 'random'
        // };
        // req.session.account = account;
        // res.redirect('../home');
    }
    else {
        let url = req.headers.referer || '../home';
        console.log(`referer: ${req.headers.referer}`);
        console.log(`redirecting to ${url}`);
        res.redirect(url);
    }
});

router.post('/login', function (req, res) {

    console.log(req.body);

    // check valid account
    // ...
    
    req.session.isLogin = true;
    const account = {
        username: req.body.username,
        password: req.body.password
    };
    req.session.account = account;
    // res.redirect('../home');
    res.json({
        result: true,
        redirect: '/home'
    });
});
