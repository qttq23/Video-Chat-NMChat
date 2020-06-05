const router = require('express').Router();
module.exports = router;

const model = require('../models/user.model');


// get profile
router.get('/profile', function(req, res) {

    console.log('get user/profile');
    console.log(req.query.id);

    (async() => {
        const userProfile = await model.get_user_by_id(req.query.id);
        console.log(userProfile);

        res.render('user/profile', {
            userProfile: userProfile
        });
    })();



});


// update profile
router.post('/profile', function(req, res) {
    console.log('post user/profile');
    console.log(req.body);

    const newProfile = req.body.profile;
    //const result = model.update(newProfile);

    if (result === true) {
        res.json({
            result: true
        });
    } else {
        res.json({
            result: false,
            msg: 'update profile failed.'
        });
    }
});