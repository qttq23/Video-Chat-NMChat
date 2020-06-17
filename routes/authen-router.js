const express = require('express');
const userModel = require('../models/user.model');

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
    } else {
        let url = req.headers.referer || '../home';
        console.log(`referer: ${req.headers.referer}`);
        console.log(`redirecting to ${url}`);
        res.redirect(url);
    }
});

router.post('/login', async function (req, res) {

    console.log('post /login');
    console.log(req.body);

    // check valid account
    let result = await userModel.get_user_by_email(req.body.username);
    let user = result[0];
    console.log(user);

    
    if (!user || req.body.password !== user.Password) {
        console.log('not match');
        res.json({
            result: false,
            msg: 'sign in failed! Check your username and password'
        });
        return;
    }

    // check if account already active in somewhere
    function checkActive() {
        return new Promise(
            function (resolve, reject) {
                req.sessionStore.all((err, sessions) => {
                    console.log(sessions);

                    for (var key of Object.keys(sessions)) {
                        if (sessions[key].isLogin === true &&
                            sessions[key].account.UserID == user.UserID) {


                            // this means account already active
                            // -> not allow multiple login
                            console.log('found already active');
                            res.json({
                                result: false,
                                msg: 'Your account already loggin in somewhere. Please logout first then try login'
                            });
                            return;
                        }
                    }

                    resolve();
                });
            }

        );
    }
    await checkActive();

    // everything ok -> redirect to homepage
    req.session.isLogin = true;
    req.session.account = user;
    res.json({
        result: true,
        redirect: '/home'
    });
});


router.get('/signup', async function (req, res) {

    console.log('get /signup');
    // console.log(req.query.e);
    // console.log(req.query.p);

    // const { v4: uuidv4 } = require('uuid');
    // const uniqueInsuranceId = uuidv4();

    // const result = await userModel.add({
    //     UserID: uniqueInsuranceId,
    //     Name: req.query.e,
    //     Email: req.query.e,
    //     Password: req.query.p,
    //     AvatarUrl: '',
    //     BirthDate: '',
    //     PhoneNumber: '',
    // });
    // result.catch((e)=>{
    //     console.log(e);
    // });

    // console.log(result);
    // res.send(result);

    res.render('signup/signup', {

    });

});

router.post('/signup', async function (req, res) {

    console.log('post signup');
    console.log(req.body);

    // check same email, encrypt password
    // get user by email
    let user = await userModel.get_user_by_email(req.body.username);
    console.log(user);
    if(user && user.length > 0){
        // email exists
        res.json({
            resutl: false,
            msg: 'sign up failed. Email already exists'
        });
        return;
    }



    // generate uuid
    const { v4: uuidv4 } = require('uuid');
    const uniqueInsuranceId = uuidv4();

    // save to database
    const result = await userModel.add(
        uniqueInsuranceId,
        req.body.name,
        req.body.username,  // email
        req.body.password,
        "",
        "1995-03-16 00:00:00",
        "013123123222"
    );
    console.log(result);
    if (result.affectedRows == 1) {

        res.json({
            result: true,
            redirect: '/authen/login'
        });
    }
    else {
        res.json({
            result: false,
            msg: 'sign up failed.'
        });
    }


});

router.post('/logout', async function (req, res) {

    console.log('post /logout');


    // remove information
    req.session.isLogin = false;
    req.session.account = null;

    // redirect to login
    res.json({
        result: true,
        redirect: '../home'
    });
});

