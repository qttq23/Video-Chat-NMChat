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
        // {
        //     'urls': 'stun:stun2.l.google.com:19305'
        // },



        // {
        //     'urls': 'turn:numb.viagenie.ca',
        //     'credential': 'muazkh',
        //     'username': 'webrtc@live.com'
        // },
        // {
        //     url: 'turn:numb.viagenie.ca',
        //     credential: 'muazkh',
        //     username: 'webrtc@live.com'
        // },

        {
            'urls': 'turn:numb.viagenie.ca',
            'credential': 'irous',
            'username': 'buithang1999a@gmail.com'
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

// var isMicro = false;
// var isVideo = true;
// var isAudio = true;

var camVideoTrack;
var currentTrack;
var microTrack;
var mainVideo = document.querySelector('#remmote-video-large');

// status of devices are being used
// by default, participant will not use micro
// but use video and audio
var currentState = {
    isMicro: false,
    isVideo: true,
    isAudio: true,
};

// rules of room to use or not use devices
var roomConfig = null;

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
    console.log('room finished');
    // alert('room finished');
    window.location.href = '/unknown?state=roomfinished';
});


//////////////////

// kick participant
$('#btnKick').click(function () {

    let userId = $('#edtKick').val();
    socket.emit('kick', userId);
});

socket.on('kicked', function () {

    window.location.href = '/unknown?state=kicked';

});

$('.video-call').click(function(){
    // check if host
    if(isHost === true){
        console.log('host set main screen');

        let peerId = $(this).attr('title');
        if (!peerId || peerId == ''){
            return;
        }

        // tell everyone set main screen
        socket.emit('main screen', peerId);
    }
});

socket.on('main screen', (peerId)=>{

    forceMainScreen(peerId);
});


function forceMainScreen(peerId){

    console.log('force main screen');
    // get peerId
    let peer = findPeerById(peerId);
    let stream;
    if (peer != null) {
        stream = peer.stream;
    }
    else if (localId === peerId) {
        console.log('set local video as main video');
        stream = localVideo.srcObject;
    }
    else {
        // maybe not yet connect to peerId
        // wait some seconds and set main screen again
        (() => {
            setTimeout(() => {
                forceMainScreen(peerId);
            }, 3000);
        })();
        return;
    }

    // set to main screen
    
    mainVideo.srcObject = stream;
    mainVideo.title = peerId;
}

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

    // request messages and configs in room
    socket.emit('get messages');
});


socket.on('joined', function (room) {
    console.log('joined: ' + room);
    // isChannelReady = true;
    isInRoom = true;

    // request messages and configs in room
    socket.emit('get messages');
});

socket.on('full', function(){
    window.location.href = '/unknown?state=roomFull';
});

// receive room configs
socket.on('config', function (config) {

    console.log(config);
    roomConfig = config;

    // apply configs
    applyConfig(roomConfig);
});

// after this function
// current state will be updated
function applyConfig(config){
    
    if(config.isVideo === false){
        turnOnVideo(false);
    }
    if(config.isMicro === false){
        turnOnMicro(false);
    }
    if(config.isAudio === false){
        turnOnAudio(false);
    }
    
}

function turnOnVideo(isOn){
    if(isOn === true){
        // start video
        // ...
        
        // start show local
        localVideo.srcObject = localStream;
        if(mainVideo.title == localId){
            mainVideo.srcObject = localStream;
        }
        
        // start send to remotes
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.videoSender.replaceTrack(camVideoTrack);
        }
    }
    else{
        // stop camera
        // ...

        // stop send remote
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.videoSender.replaceTrack(null);
        }

        // stop show local
        localVideo.srcObject = null;
        if(mainVideo.title == localId){
            mainVideo.srcObject = null;
        }
        setVideoPoster(localVideo, userName);
    }

    // set current state
    currentState.isVideo = isOn;
    toggleVideoButton(isOn);
}



function turnOnMicro(isOn) {
    if (isOn === true) {
        // start micro
        // ...

        // start send to remotes
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.microSender.replaceTrack(microTrack);
        }

    }
    else {
        // stop micro
        // ...

        // stop send remote
        let i;
        for (i = 0; i < peers.length; i++) {
            var peer = peers[i];
            var connection = peers[i].connection;
            peer.microSender.replaceTrack(null);
        }
    }

    // set current state
    currentState.isMicro = isOn;
    toggleMicroButton(isOn);
}
function turnOnAudio(isOn) {
    if (isOn === true) {
        // start hear audio
        $(".remoteVideo").prop('muted', false);
    }
    else {
        // stop hear audio
        $(".remoteVideo").prop('muted', true);
    }

    // set current state
    currentState.isAudio = isOn;
    toggleAudioButton(isOn);
}

function canUseMicro(){
    if(roomConfig != null){
        return roomConfig.isMicro;
    }

    return true;
}
function canUseVideo(){
    if(roomConfig != null){
        return roomConfig.isVideo;
    }

    return true;
}
function canUseAudio() {
    if (roomConfig != null) {
        return roomConfig.isAudio;
    }

    return true;
}


///////////////////////////////////////////////////////

var localVideo = document.querySelector('.localVideo');
var remoteVideos = document.getElementsByClassName("remoteVideo");
console.log(remoteVideos);


/////////////



// video button
$('#btnVideo').click(function () {

    if (currentState.isVideo === true) {

        // alert('click stop video');
        
        turnOnVideo(false);
        
    }
    else {
        // check config if can turn on video
        if (canUseVideo() === false) {
            alert('host not allow you to use video');
            return;
        }

        // alert('click start video');
        turnOnVideo(true);
    }


});

// micro button
$('#btnMicro').click(function () {


    if (currentState.isMicro === true) {

        // alert('click stop micro');

        turnOnMicro(false);

    }
    else {
        // check config if can turn on video
        if (canUseMicro() === false) {
            alert('host not allow you to use micro');
            return;
        }

        // alert('click start micro');
        turnOnMicro(true);
    }

});

// audio button
$('#btnAudio').click(function () {

    if (currentState.isAudio === true) {

        // alert('click stop audio');

        turnOnAudio(false);

    }
    else {
        // check config if can turn on video
        if (canUseAudio() === false) {
            alert('host not allow you to use audio');
            return;
        }

        // alert('click start audio');
        turnOnAudio(true);
    }

});


// check box
$('#checkVideo').click(function () {
    setConfig();
});

$('#checkMicro').click(function () {
    setConfig();
});

function setConfig() {

    let config = { 
        isVideo: true, 
        isMicro: true,
        isAudio: true,
    };
    config.isVideo = $("#checkVideo").is(':checked');
    config.isMicro = $("#checkMicro").is(':checked');

    console.log(config);
    // send to remote
    socket.emit('set config', config);

}

// send messages
$("#formSendMessage").submit(function (e) {

    // get content in edit box
    let content = $(input_message).val();
    console.log(content);


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

    return false;
});

socket.on('msg', (message) => {
    console.log('msg received');
    $(txtMessages).append('<br>' + message.from + ': ' + message.content);

});


/// get list participants
$(btnParticipants).click(function () {

    // request list of participants
    socket.emit('participants');
});

socket.on('participants', (participants) => {

    // clear old data
    let divParticipants = $('#divParticipants');
    divParticipants.html('');

    // append new data
    let i;
    for (i = 0; i < participants.length; i++) {

        let name = participants[i];
        if (name === userName){
            name += ' <b>(You)</b>';
        }

        let html = `
            <div class="participant-cell">
                <span>${name}</span>
                <div class="cell-options">
                    <a name="" id="mute-participant" class="btn btn-danger diagonal-line" href="#"
                        role="button">
                        <i class="fa fa-volume-up" aria-hidden="true"></i>
                    </a>
                    <a name="" id="disable-camera-participant" class="btn btn-danger diagonal-line" href="#"
                        role="button">
                        <i class="fa fa-video-camera" aria-hidden="true"></i>
                    </a>
                </div>
                <br>
                <br>
                <hr>
            </div>
            `;
        
        divParticipants.append(html);
    }
});

socket.on('peer out', (peerId)=>{
    
    
    // remove logic
    // let peer = findPeerById(peerId);
    // peers.pop(peer);

    // remove ui
    let i = findIndexById(peerId);
    try {
        remoteVideos[i].style.display = "none";
    }
    catch (err) {}
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



function gotStream(stream) {
    console.log('Adding local stream.');
    localStream = stream;
    localVideo.srcObject = stream;
    localVideo.title = localId;
    isGotMedia = true;

    // apply config
    if(roomConfig != null){
        applyConfig(roomConfig);
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
                // already in room and got media
                // send ready signal to others
                console.log('is in room, and got stream => READY');
                socket.emit('got user media', { from: localId, email: userName });

            }
        }
            , 2000);
    };

    myTimeout();

}

////////////////////////////////////
/////////////

function getScreen(sourceId) {
    var constraints = {
        mandatory: {
            chromeMediaSource: 'desktop',
            maxWidth: screen.width > 1920 ? screen.width : 1920,
            maxHeight: screen.height > 1080 ? screen.height : 1080,
            chromeMediaSourceId: sourceId
        },
        optional: [
            { googTemporalLayeredScreencast: true }
        ]
    };
    navigator.getUserMedia({ video: constraints },
        stream => {

            // add new stream to local
            console.log('changed local stream to screen. num connections: ' + peers.length);
            // localStream = stream;
            localVideo.srcObject = stream;
            currentTrack = stream.getVideoTracks()[0];
            if(mainVideo.title == localId){
                mainVideo.srcObject = stream;
            }

            // re-add stream track to all remotes
            var i;
            for (i = 0; i < peers.length; i++) {
                var peer = peers[i];
                var connection = peers[i].connection;

                peer.videoSender.replaceTrack(currentTrack);
            }


            // when stop share
            stream.getVideoTracks()[0].onended = function () {
                // doWhatYouNeedToDo();
                // switch
                localVideo.srcObject = localStream;
                currentTrack = localStream.getVideoTracks()[0];
                if (mainVideo.title == localId) {
                    mainVideo.srcObject = localStream;
                }


                // re-add stream track to all remotes
                var i;
                for (i = 0; i < peers.length; i++) {
                    var peer = peers[i];
                    var connection = peers[i].connection;
                    peer.videoSender.replaceTrack(currentTrack);
                }
            };

        },
        error => {
            console.log(error);
        }
    );
}

window.addEventListener("message", function (msg) {
    if (!msg.data) {
        // window.open('/guide/share-screen-instruction.html');
        return;
    } else if (msg.data.sourceId) {
        getScreen(msg.data.sourceId);
    } else if (msg.data.addonInstalled) {
        $('#addon-not-found').hide();
        $('#share-my-screen').removeAttr('disabled');
    }

}, false);


var btnShareScreen = document.querySelector('#btnShareScreen');
btnShareScreen.onclick = function () {
    if(confirm('Do you want to view instructions to enable share screen?') === true){
        window.open('/guide/share-screen-instruction.html');
    }
    else{
        window.postMessage('requestScreenSourceId', '*');
    }
};
///////////////


///////////////////////////////////////////////////////


socket.on('got user media', (data) => {

    console.log('someone is ready, create connection to that');
    console.log(data);

    // create connection
    var connection = createPeerConnection(data.from);
    var newPeer = {
        id: data.from,
        connection: connection,
        email: data.email
    };
    peers.push(newPeer);

    while (!isGotMedia) { }
    // connection.addStream(localStream);
    newPeer.videoSender = connection.addTrack(currentTrack, localStream);
    newPeer.microSender = connection.addTrack(microTrack, localStream);
    if (currentState.isMicro === false) {
        newPeer.microSender.replaceTrack(null);
    }
    if (currentState.isVideo === false) {
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
        if (currentState.isMicro === false) {
            newPeer.microSender.replaceTrack(null);
        }
        if (currentState.isVideo === false) {
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
            remoteVideos[index].title = toId;
        };

        //https://stackoverflow.com/questions/60636439/webrtc-how-to-detect-when-a-stream-or-track-gets-removed-from-a-peerconnection
        connection.ontrack = ({ track, streams: [stream] }) => {
            track.onunmute = () => {
                // if (!video.srcObject) video.srcObject = stream;
                console.log('on ummute');

                if (track.kind === 'video') {
                    // replace video by stream
                    var index = findIndexById(toId);
                    remoteVideos[index].srcObject = stream;

                    if (mainVideo.title === toId) {
                        mainVideo.srcObject = stream;
                    }
                }

            };
            stream.onremovetrack = ({ track }) => {

                console.log('on removetrack');
            };
            track.onmute = () => {
                console.log('on mute');
                console.log(track);


                if (track.kind === 'video') {
                    // replace video by image
                    var index = findIndexById(toId);
                    remoteVideos[index].srcObject = null;
                    // $(remoteVideos[index]).attr('poster', getIconUrl(peers[index].email));
                    setVideoPoster(remoteVideos[index], peers[index].email);

                    if(mainVideo.title === toId){
                        mainVideo.srcObject = null;
                    }
                }
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
    let i;
    for (i = 0; i < peers.length; i++) {
        if (peers[i].id == id) {
            return peers[i];
        }
    }
    return null;
}

function findIndexById(id) {
    let i;
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


function setVideoPoster(video, userId) {
    $.ajax({
        type: 'GET',
        url: `/upload/user/${userId}/icon.png`,

        error: function (xhr) {
            console.log('no source found, try set default poster');
            $(video).attr('poster', '/images/icons/default_user.png');
        },
        success: function (json) {
            $(video).attr('poster', `/upload/user/${userId}/icon.png`);

        }
    });
}