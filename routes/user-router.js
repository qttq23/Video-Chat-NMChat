const router = require('express').Router();
module.exports = router;

const model = require('../models/user.model');

const db = require('../utils/database.util');

// get profile
router.get('/profile', function(req, res) {

    console.log('get user/profile');
    let queryId = req.query.id;
    console.log(queryId);

    // simplify url to view self profile
    // user just need to user/profile instead of user/profile?id=<self id>
    if(!queryId){
        queryId = req.session.account.UserID;
    }

    (async() => {
        let userProfile = await model.get_user_by_id(queryId);
        console.log(userProfile);
        userProfile = userProfile[0];

        let isEdit = false;
        if(userProfile.UserID === req.session.account.UserID){
            isEdit = true;
        }

        res.render('user/profile', {
            userProfile: userProfile,
            isEdit: isEdit
        });
    })();



});


// update profile
router.post('/profile', async function(req, res) {
    console.log('post user/profile');
    console.log(req.body);

    const newProfile = req.session.account;
    newProfile.Name = req.body.name;
    newProfile.BirthDate = req.body.birthdate;
    newProfile.PhoneNumber = req.body.phone;

    // const result = model.update(newProfile);
    let result = 'init';
    result = await db.query(`update users
     set Name="${newProfile.Name}", 
        BirthDate="${newProfile.BirthDate}",
        PhoneNumber="${newProfile.PhoneNumber}"
     where UserID="${newProfile.UserID}" `);
     console.log(result);


    if (result && result.affectedRows == 1) {
        res.json({
            result: true,
            msg: 'information updated'
        });
    } else {
        res.json({
            result: false,
            msg: 'update profile failed.'
        });
    }
});


router.post('/upload', function (req, res) {

    console.log('post /user/upload');
    // console.log(req.body);
    // console.log(req.files);

    // check if file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({ result: false, msg: 'No files were uploaded.' });
    }

    // get file to save and path to save
    let file = req.files.myfile;
    let pathToDownLoad = `/upload/user/${req.session.account.Email}/icon.png`;
    let pathToSave = PUBLIC_PATH + pathToDownLoad;
    console.log(pathToSave);

    // Use the mv() method to place the file somewhere on your server
    file.mv(pathToSave, function (err) {
        if (err)
            return res.json({ result: false, msg: err });

        res.json({
            result: true,
            msg: 'File uploaded!',
            path: pathToDownLoad,
            filename: 'icon.png'
        });
    });

});

