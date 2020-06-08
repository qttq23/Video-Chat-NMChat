

const router = require('express').Router();
module.exports = router; 

const roomManager = require('../utils/room-manager');
roomManager.startSocketIO();



router.post('/create', function (req, res) {

    console.log('post /room/create');
    console.log(req.session.account);
    console.log(req.body.roomName);

    const roomName = req.body.roomName;
    const host = req.session.account;

    // check restricts...
    if (req.session.isAlreadyInRoom === true) {
        res.json({
            result: false,
            msg: 'You are already in one room. leave room to create another room.'
        });
        return;
    }



    if (roomManager.canCreate(roomName)) {
        roomManager.create(roomName, host);
        // res.redirect('/room?id=' + roomName);
        res.json({
            result: true,
            redirect: '/room?id=' + roomName
        });
    }
    else {
        res.json({
            result: false,
            msg: 'cannot create room'
        });
    }
});

router.post('/join', function (req, res) {

    console.log('post /room/join');
    console.log(req.session.account);
    console.log(req.body.roomName);

    const roomName = req.body.roomName;
    const participant = req.session.account;

    // check restricts...
    if (req.session.isAlreadyInRoom === true) {
        res.json({
            result: false,
            msg: 'You are already in one room. leave room to join another room.'
        });
        return;
    }



    if (roomManager.canJoin(roomName, participant)) {
        // roomManager.create(roomName, participant);
        // res.redirect('/room?id=' + roomName);
        res.json({
            result: true,
            redirect: '/room?id=' + roomName
        });
    }
    else {
        res.json({
            result: false,
            msg: 'cannot join room'
        });
    }
});



router.get('/', function (req, res) {

    console.log('get room: ' + req.query.id);

    // check restricts...
    // if(req.session.isAlreadyInRoom === true){
    //     res.end('You are already in one room. leave room to join another room.');
    //     return;
    // }

    var roomInfo = roomManager.getRoomInfo(req.query.id);
    console.log(roomInfo);
    if (!roomInfo) {
        res.end('Room not found');
        return;
    }


    // go to room
    req.session.isAlreadyInRoom = true;
    var isHost = false;
    if (roomInfo.host.Email === req.session.account.Email) {
        isHost = true
    }

    // if all ok, send room page
    res.render('room/meeting_room', {
        roomInfo: roomInfo,
        isHost: isHost,
        userId: req.session.account.Email
    });
});

router.post('/leave', function (req, res) {
    console.log('leave room: ' + req.body.id);

    req.session.isAlreadyInRoom = false;
    res.json({ result: true });
});


router.post('/upload', function(req, res){

    console.log('post /room/upload');
    // console.log(req.body);
    // console.log(req.files);

    // check if file exists
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.json({result: false, msg: 'No files were uploaded.'});
    }

    // get file to save and path to save
    let file = req.files.myfile;
    let pathToSave = PUBLIC_PATH + `/upload/roomid/${file.name}`;
    console.log(pathToSave);

    // Use the mv() method to place the file somewhere on your server
    file.mv(pathToSave, function (err) {
        if (err)
            return res.json({result: false, msg: err});

        res.json({
            result: true,
            msg: 'File uploaded!',
            path: `/upload/roomid/${file.name}`
        });
    });

});



