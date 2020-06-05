'use strict';

var isChannelReady = false;
var isInitiator = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;

var pcConfig = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    },
    {
        'urls': 'turn:numb.viagenie.ca',
        'credential': 'bthang',
        'username': '1753102@student.hcmus.edu.vn'
    }
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
    $.ajax({
        method: 'post',
        url: '/room/leave',
        data: {
            id: room
        }
        

    }).done(function (json) {
        console.log(json);
    });

})


//////////////////


if (room !== '') {
    if(isHost === true){
    }
    else{

    }
    socket.emit('create or join', room);
    console.log('Attempted to create or  join room', room);
}

socket.on('created', function (room) {
    console.log('Created room ' + room);
    // isInitiator = true;
    isInRoom = true;
});


socket.on('joined', function (room) {
    console.log('joined: ' + room);
    // isChannelReady = true;
    isInRoom = true;
});

///////////////////////////////////////////////////////

var localVideo = document.querySelector('.localVideo');
var remoteVideos = document.getElementsByClassName("remoteVideo");
console.log(remoteVideos);


/////////////

///////////////

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
})
    .then(gotStream)
    .catch(function (e) {
        alert('getUserMedia() error2: ' + e.name);
    });


var camVideoTrack;
var currentTrack;

function gotStream(stream) {
    console.log('Adding local stream.');
    localStream = stream;
    localVideo.srcObject = stream;
    isGotMedia = true;

    camVideoTrack = localStream.getVideoTracks()[0];
    currentTrack = localStream.getVideoTracks()[0];

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


socket.on('disconnect', ()=>{
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
