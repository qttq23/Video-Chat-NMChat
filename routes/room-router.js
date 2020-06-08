

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
})



