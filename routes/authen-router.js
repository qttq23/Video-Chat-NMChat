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
    console.log("start");
    console.log(result);

    let user = result[0];
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


router.get('/signup',async function(req, res){

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

router.post('/signup', async function(req, res){

    console.log('post signup');
    console.log(req.body);

    // check same email, encrypt password
    // ...

    const { v4: uuidv4 } = require('uuid');
    const uniqueInsuranceId = uuidv4();

    const result = await userModel.add(
        uniqueInsuranceId,
        req.body.name,
        req.body.username,
        req.body.password,
        "",
        "1995-03-16 00:00:00",
        "013123123222"
    );
    console.log(result);
    if(result.affectedRows == 1){

        res.json({
            result: true,
            redirect: '/authen/login'
        });
    }
    else{
        res.json({
            msg: 'sign up failed.'
        });
    }

    // const result = await userModel.add({
    //     UserID: uniqueInsuranceId,
    //     Name: req.query.e,
    //     Email: req.query.e,
    //     Password: req.query.p,
    //     AvatarUrl: '',
    //     BirthDate: '',
    //     PhoneNumber: '',
    // });

});

