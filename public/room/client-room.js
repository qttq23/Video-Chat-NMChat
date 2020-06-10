'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;

var pcConfig = {
    'iceServers': [
        {
            'urls': 'stun:stun.l.google.com:19302'
        },
        {
            'urls': 'stun:stun2.l.google.com:19305'
        },



        {
            'urls': 'turn:numb.viagenie.ca',
            'credential': 'muazkh',
            'username': 'webrtc@live.com'
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },

   
    ]
};

// Set up audio and video regardless of what devices are present.
var sdpConstraints = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

// array of peers
var localId = '';
var peers = [];

var isInRoom = false;
var isGotMedia = false;

var isMicro = false;
var isVideo = true;
var isAudio = true;
var localConfig = null;
/////////////////////////////////////////////

var room = roomName;
// Could prompt for room name:
// room = prompt('Enter room name:');

var socket = io.connect();

socket.on('connect', () => {
    socket.emit('get id', (returnedId) => {
        localId = returnedId;
    });


});

/////////////////////

$(window).on("beforeunload", function () {


    // tell http server that user leave room
    $.ajax({
        method: 'post',
        url: '/room/leave',
        data: {
            id: room
        }


    }).done(function (json) {
        console.log(json);
    });

    // another signal will be automatically sent to SocketIO when client disconnected
});



// leave room
$('#btnLeave').click(function () {

    // alert ok & cancel
    let prompt = 'Do you want to leave this room?';
    if (isHost) {
        prompt = 'Do you want to finish this room?';
    }
    let isOk = confirm(prompt);

    // if ok -> leave
    if (isOk === true) {


        // just navigate to home
        // unload event will be triggered
        // leave room implemented in that
        window.location.href = '/home';

    }
});


socket.on('room finished', () => {
    // host leave and force others to leave
    // participant just leave
    window.location.href = '/unknown?state=roomfinished';
});

socket.on('config', function (config) {

    console.log(config);
    localConfig = config;

    // apply configs
    if (config.isVideo === false) {

        isVideo = true;
        $('#btnVideo').trigger('click');
    }
    if (config.isMicro === false) {

        isMicro = true;
        $('#btnMicro').trigger('click');

    }
})

//////////////////

// kick participant
$('#btnKick').click(function () {

    let userId = $('#edtKick').val();
    socket.emit('kick', userId);
});

socket.on('kicked', function () {

    window.location.href = '/unknown?state=kicked';

});


//////////////////


if (room !== '') {
    if (isHost === true) {
    }
    else {

    }
    socket.emit('create or join', room, userName);
    console.log('Attempted to create or  join room', room);
}

socket.on('created', function (room) {
    console.log('Created room ' + room);
    // isInitiator = true;
    isInRoom = true;

    // request messages in room
    socket.emit('get messages');
});


socket.on('joined', function (room) {
    console.log('joined: ' + room);
    // isChannelReady = true;
    isInRoom = true;

    // request messages in room
    socket.emit('get messages');
});

///////////////////////////////////////////////////////

var localVideo = document.querySelector('.localVideo');
var remoteVideos = document.getElementsByClassName("remoteVideo");
console.log(remoteVideos);


/////////////


// micro button
$('#btnMicro').click(function () {

    if (isMicro == true) {

        alert('click stop micro');

        // stop micro
        isMicro = false;

        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.microSender.replaceTrack(null);
        }

        $(this).html('enable micro');
    }
    else {
        // check config if can turn on micro
        if (localConfig.isMicro === false) {
            alert('host not allow you to use micro');
            return;
        }


        alert('click start micro');

        // start micro
        isMicro = true;
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.microSender.replaceTrack(microTrack);
        }

        $(this).html('stop micro');
    }
});

// video button
$('#btnVideo').click(function () {

    if (isVideo === true) {

        alert('click stop video');

        // stop video
        isVideo = false;

        // not show local
        localVideo.srcObject = null;

        // not send to remotes
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.videoSender.replaceTrack(null);
        }

        $(this).html('start video');
    }
    else {
        // check config if can turn on video
        if (localConfig.isVideo === false) {
            alert('host not allow you to use video');
            return;
        }

        alert('click start video');

        // start video
        isVideo = true;

        // show local
        localVideo.srcObject = localStream;

        // send to remotes
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.videoSender.replaceTrack(camVideoTrack);
        }

        $(this).html('stop video');
    }


});


// audio button
$('#btnAudio').click(function () {

    if (isAudio === true) {

        alert('click stop audio');

        // stop audio
        isAudio = false;

        $(".remoteVideo").prop('muted', true);


        $(this).html('start audio');
    }
    else {

        alert('click  start audio');

        // start micro
        isAudio = true;
        $(".remoteVideo").prop('muted', false);

        $(this).html('stop audio');
    }
});


$('#checkVideo').click(function () {
    setConfig();
});

$('#checkMicro').click(function () {
    setConfig();
});

function setConfig() {

    let config = { isVideo: false, isMicro: false };
    config.isVideo = $("#checkVideo").is(':checked');
    config.isMicro = $("#checkMicro").is(':checked');

    console.log(config);
    // send to remote
    socket.emit('set config', config);

}

// send messages
$(btnSend).click(function () {

    // get content in edit box
    let content = $(input_message).val();
    // alert(content);

    // send to socketio server
    let message = {
        from: userName,
        to: 'all',
        type: 'text',
        content: content
    }
    socket.emit('msg', message);

    // update local messages
    $(txtMessages).append('<br>' + 'you: ' + content);
    $(input_message).val('');
});

socket.on('msg', (message) => {
    console.log('msg received');
    $(txtMessages).append('<br>' + message.from + ': ' + message.content);

});


///////////////

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
})
    .then(gotStream)
    .catch(function (e) {
        alert('getUserMedia() error2: ' + e.name);
    });


var camVideoTrack;
var currentTrack;
var microTrack;

function gotStream(stream) {
    console.log('Adding local stream.');
    localStream = stream;
    localVideo.srcObject = stream;
    isGotMedia = true;

    // apply config
    if (isVideo === false) {
        localVideo.srcObject = null;
    }

    // get tracks
    camVideoTrack = localStream.getVideoTracks()[0];
    currentTrack = localStream.getVideoTracks()[0];
    microTrack = localStream.getAudioTracks()[0];

    // while(!isInRoom || !isGotMedia){}
    var myTimeout = () => {
        setTimeout(function () {
            if (!isInRoom || !isGotMedia) {
                console.log('continue set timeout');
                myTimeout();
            }
            else {
                console.log('is in room, and got stream => READY');
                socket.emit('got user media', { from: localId });

            }
        }
            , 2000);
    };

    myTimeout();

}

var constraints = {
    video: true
};



///////////////////////////////////////////////////////


socket.on('got user media', (data) => {

    console.log('someone is ready, create connection to that');
    console.log(data);

    // create connection
    var connection = createPeerConnection(data.from);
    var newPeer = {
        id: data.from,
        connection: connection
    };
    peers.push(newPeer);

    while (!isGotMedia) { }
    // connection.addStream(localStream);
    newPeer.videoSender = connection.addTrack(currentTrack, localStream);
    newPeer.microSender = connection.addTrack(microTrack, localStream);
    if (isMicro === false) {
        console.log('is micro: ' + isMicro);
        newPeer.microSender.replaceTrack(null);
    }
    if (isVideo === false) {
        console.log('is video: ' + isVideo);
        newPeer.videoSender.replaceTrack(null);
    }

    // send offer
    console.log('Sending offer to new peer');
    connection.createOffer((sessionDescription) => {

        connection.setLocalDescription(sessionDescription);

        console.log('setLocalAndSendMessage sending message offer', sessionDescription);
        socket.emit('offer', {
            from: localId,
            to: newPeer.id,
            message: sessionDescription
        });

    }, handleCreateOfferError);

});

socket.on('offer', (data) => {

    console.log('receive offer');
    console.log(data);

    if (data.to == localId) {

        // create connection
        var connection = createPeerConnection(data.from);
        var newPeer = {
            id: data.from,
            connection: connection
        };
        peers.push(newPeer);

        while (!isGotMedia) { }
        // connection.addStream(localStream);
        newPeer.videoSender = connection.addTrack(currentTrack, localStream);
        newPeer.microSender = connection.addTrack(microTrack, localStream);
        if (isMicro === false) {
            console.log('is micro: ' + isMicro);
            newPeer.microSender.replaceTrack(null);
        }
        if (isVideo === false) {
            console.log('is video: ' + isVideo);
            newPeer.videoSender.replaceTrack(null);
        }

        // accept
        connection.setRemoteDescription(new RTCSessionDescription(data.message));
        // doAnswer();

        console.log('Sending answer to peer.');
        connection.createAnswer().then(
            (sessionDescription) => {
                connection.setLocalDescription(sessionDescription);
                console.log('setLocalAndSendMessage sending message answer', sessionDescription);
                // sendMessage(sessionDescription);
                socket.emit('answer', {
                    from: localId,
                    to: newPeer.id,
                    message: sessionDescription
                });
            },
            onCreateSessionDescriptionError
        );
    }

});

socket.on('answer', (data) => {
    console.log('receive answer');
    console.log(data);

    if (data.to == localId) {

        // accept answer
        var peer = findPeerById(data.from);
        peer.connection.setRemoteDescription(new RTCSessionDescription(data.message));

    }
});



socket.on('candidate', (data) => {
    console.log('receive candidate message in nowhere');
    console.log(data);

    if (data.to == localId && data.message.type === 'candidate') {

        var message = data.message;
        var candidate = new RTCIceCandidate({
            sdpMLineIndex: message.label,
            candidate: message.candidate
        });


        var peer = findPeerById(data.from);
        peer.connection.addIceCandidate(candidate);
    }
});


socket.on('disconnect', () => {
    socket.emit('bye');
})


if (location.hostname !== 'localhost') {
    requestTurn(
        'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
    );
}


/////////////////////////////////////////////////////////

function createPeerConnection(toId) {
    var connection = null;
    try {
        connection = new RTCPeerConnection(pcConfig);


        connection.onicecandidate = (event) => {
            console.log('icecandidate event (updated): ', event);

            if (event.candidate) {

                socket.emit('candidate', {
                    // custom
                    from: localId,
                    to: toId,
                    candidate: event.candidate,
                    // default
                    message: {
                        type: 'candidate',
                        label: event.candidate.sdpMLineIndex,
                        id: event.candidate.sdpMid,
                        candidate: event.candidate.candidate
                    }

                });

            } else {
                console.log('End of candidates.');
            }
        };

        connection.onaddstream = (event) => {
            console.log('Remote stream added.');
            console.log(event);

            var peer = findPeerById(toId);
            peer.stream = event.stream;
            var index = findIndexById(toId);
            console.log('found index: ' + index);
            remoteVideos[index].srcObject = event.stream;
        };

        //https://stackoverflow.com/questions/60636439/webrtc-how-to-detect-when-a-stream-or-track-gets-removed-from-a-peerconnection
        connection.ontrack = ({ track, streams: [stream] }) => {
            track.onunmute = () => {
                // if (!video.srcObject) video.srcObject = stream;
                console.log('on ummute');
                // if (track.kind === 'video') {
                //     // replace video by stream
                //     var index = findIndexById(toId);
                //     remoteVideos[index].srcObject = stream;
                // }

            };
            stream.onremovetrack = ({ track }) => {

                console.log('on removetrack');
            };
            track.onmute = () => {
                console.log('on mute');
                console.log(track);

                // if (track.kind === 'video') {
                //     // replace video by image
                //     var index = findIndexById(toId);
                //     remoteVideos[index].srcObject = null;
                // }
            };
        };


        // connection.onremovestream = handleRemoteStreamRemoved;
        console.log('Created RTCPeerConnnection');

    } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message);
        alert('Cannot create RTCPeerConnection object.');
    }

    return connection;
}

function findPeerById(id) {
    var i;
    for (i = 0; i < peers.length; i++) {
        if (peers[i].id == id) {
            return peers[i];
        }
    }
    return null;
}

function findIndexById(id) {
    var i;
    for (i = 0; i < peers.length; i++) {
        if (peers[i].id == id) {
            return i;
        }
    }
    return -1;
}

function handleCreateOfferError(event) {
    console.log('createOffer() error: ', event);
}


function onCreateSessionDescriptionError(error) {
    // trace('Failed to create session description: ' + error.toString());
    console.log('Failed to create session description: ' + error.toString());
}



function requestTurn(turnURL) {
    var turnExists = false;
    for (var i in pcConfig.iceServers) {
        if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
            turnExists = true;
            turnReady = true;
            break;
        }
    }
    if (!turnExists) {
        console.log('Getting TURN server from ', turnURL);
        // No TURN server. Get one from computeengineondemand.appspot.com:
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var turnServer = JSON.parse(xhr.responseText);
                console.log('Got TURN server: ', turnServer);
                pcConfig.iceServers.push({
                    'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
                    'credential': turnServer.password
                });
                turnReady = true;
            }
        };
        xhr.open('GET', turnURL, true);
        xhr.send();


    }
}
