
const router = require('express').Router();
module.exports = router;


// get profile
router.get('/profile', function (req, res) {

    console.log('get user/profile');
    console.log(req.query.id);

    const userProfile = model.get(req.query.id);
    res.render('user/profile', {
        userProfile: userProfile
    });

});


// update profile
router.post('/profile', function (req, res) {

    console.log('post user/profile');
    console.log(req.body);

    const newProfile = req.body.profile;
    const result = model.update(newProfile);

    if (result === true) {
        res.json({
            result: true
        });
    }
    else {
        res.json({
            result: false,
            msg: 'update profile failed.'
        });
    }
});

