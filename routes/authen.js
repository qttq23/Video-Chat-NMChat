const express = require('express');
const userModel = require('../models/user.model');

const router = express.Router();
module.exports = router;


// login
router.get('/login', function(req, res) {

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
    } else {
        let url = req.headers.referer || '../home';
        console.log(`referer: ${req.headers.referer}`);
        console.log(`redirecting to ${url}`);
        res.redirect(url);
    }
});

router.post('/login', async function(req, res) {

    console.log(req.body);

    // check valid account
    let result = await userModel.get_user_by_email(req.body.username);
    console.log(result);
    console.log(result);

    let user = result;
    if (!user || user.Password !== req.body.password) {
        res.json({
            result: false,
            msg: 'sign in failed!'
        });
        return;
    }
    // ...

    req.session.isLogin = true;
    req.session.account = user;
    // res.redirect('../home');
    res.json({
        result: true,
        redirect: '/home'
    });
});