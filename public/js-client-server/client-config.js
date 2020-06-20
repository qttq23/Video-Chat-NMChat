var config = {
    Title: 'NMChat',
    IconUrl: '/images/icons/blue_video_camera.png',
    BodyBackgroundColor: 'yellow',//'#329AD6',

    RoomBackgroundColor: 'red',
    DefaultVideoPoster: '/images/icons/default_user.png',
    ChatPanelBackgroundColor: 'green',
    MaxFileSizeUpload: 10485760, // equal 10 MB
};


$(() => {

    $('head').append(`<link rel="icon" type="image/png" href="${config.IconUrl}"/>`);
    $('title').append(` - ${config.Title}`);
    $('body').css('background-color', config.BodyBackgroundColor);



    $('.video-call').attr('poster', config.DefaultVideoPoster);
    $('#panelVideo').css('background-color', config.RoomBackgroundColor);
    $('#bodyRoom').css('background-color', config.RoomBackgroundColor);
    $('#panelChat').css('background-color', config.ChatPanelBackgroundColor);
    $('#panelInput').css('background-color', config.ChatPanelBackgroundColor);
    
});


