var remote_video_1 = document.getElementById("remote-video-1");
var remote_video_2 = document.getElementById("remote-video-2");
var remote_video_3 = document.getElementById("remote-video-3");
var remote_video_4 = document.getElementById("remote-video-4");
var local_video = document.getElementById("local-video");
var video_large = document.getElementById("remmote-video-large");
var input_message = document.getElementById("message");
var mute_button = document.getElementById("mute-button");
var stop_button = document.getElementById("stop-button");
var video_button = document.getElementById("video-button");

var btnSend = document.getElementById("btnSend");
var txtMessages = document.getElementById("txtMessages");
var btnLeave = document.getElementById('btnLeave');
var btnParticipants = document.getElementById('btnParticipants');

let isMicroEnable = false;
let isAudioEnable = true;
let isCallEnable = true;

// $('#btnMicro').click(function() {
//     if (isMicroEnable) {
//         $('#btnMicro').addClass('diagonal-line');
//     } else {
//         $('#btnMicro').removeClass('diagonal-line');
//     }
//     isMicroEnable = !isMicroEnable;
// });


// $('#btnAudio').click(function() {
//     if (isAudioEnable) {
//         $('#btnAudio').addClass('diagonal-line');
//     } else {
//         $('#btnAudio').removeClass('diagonal-line');
//     }
//     isAudioEnable = !isAudioEnable;
// });


// $('#btnVideo').click(function() {
//     if (isCallEnable) {
//         $('#btnVideo').addClass('diagonal-line');
//     } else {
//         $('#btnVideo').removeClass('diagonal-line');
//     }
//     isCallEnable = !isCallEnable;
// });


// isOn is desired state
function toggleMicroButton(isOn) {
    if (isOn === true) {
        $('#btnMicro').removeClass('diagonal-line');
    } else {
        $('#btnMicro').addClass('diagonal-line');
    }
}
function toggleAudioButton(isOn) {
    if (isOn === true) {
        $('#btnAudio').removeClass('diagonal-line');
    } else {
        $('#btnAudio').addClass('diagonal-line');
    }
}
function toggleVideoButton(isOn) {
    if (isOn === true) {
        $('#btnVideo').removeClass('diagonal-line');
    } else {
        $('#btnVideo').addClass('diagonal-line');
    }
}

$(()=>{
    toggleMicroButton(false);
    toggleVideoButton(true);
    toggleAudioButton(true);


});