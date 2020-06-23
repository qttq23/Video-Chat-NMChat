var config = {
    Title: 'NMChat',
    IconUrl: '/images/icons/blue_video_camera.png',
    BodyBackgroundColor: 'white',//'#329AD6',

    RoomBackgroundColor: 'darkgrey',
    ChatPanelBackgroundColor: 'white',
    DefaultVideoPoster: '/images/icons/default_user.png',
    MaxFileSizeUpload: 10485760, // equal 10 MB


    SoundJoinRoom: '/sounds/when.mp3',
    SoundLeaveRoom: '',
    SoundMessageArrived: 'sounds/insight.mp3'
};


$(() => {

    $('head').append(`<link rel="icon" type="image/png" href="${config.IconUrl}"/>`);
    $('title').append(` - ${config.Title}`);
    $('body').css('background-color', config.BodyBackgroundColor);



    
    $('#panelVideo').css('background-color', config.RoomBackgroundColor);
    $('#bodyRoom').css('background-color', config.RoomBackgroundColor);
    $('#panelChat').css('background-color', config.ChatPanelBackgroundColor);
    $('#panelInput').css('background-color', config.ChatPanelBackgroundColor);
    
    // append some remote video elements
    let n = 20;
    let htmlVideo = 
    '<video class="video-call remoteVideo" autoplay playsinline></video>' +
    '<video class="video-call remotePoster" style="display: none;"></video>';
    
    for(i = 0; i < n; i++){
        $('.video-call-parent').append(htmlVideo);
    }
    // set poster for videos
    $('.video-call').attr('poster', config.DefaultVideoPoster);
});


