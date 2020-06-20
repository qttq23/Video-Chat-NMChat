

$('#submit').click(function () {

    // check abcxyz


    // submit
    $.ajax({
        method: 'post',
        url: '/user/profile',
        data: {
            // id: $('#name').val(),
            name: $('#name').val(),
            birthdate: $('#birthday').val(),
            phone: $('#phone').val()
        }

    }).done(function (json) {
        console.log(json);

        if (json.result === true) {
            alert(json.msg);
            window.location.href = window.location.href;

            // update ui
            //...
            
        }
        else {
            alert(json.msg);
        }
    });



    //Very important line, it disable the page refresh.
    return false;
});


$('#btnChangeAvatar').click(function(){

    $('#myfile').trigger('click');
});

$('#myfile').on('change', function (e) {

    // check file size limit
    console.log(config.MaxFileSizeUpload);

    let file = e.currentTarget.files[0];
    console.log(file);
    if (file.size > config.MaxFileSizeUpload) {
        let sizeInMB = config.MaxFileSizeUpload / (1024 * 1024);
        alert(`Maximum file size is ${sizeInMB} MB`);
        $('#myfile').val('');
        return;
    }
    
    // submit to server
    $.ajax({
        type: 'POST',
        url: "/user/upload",
        data: new FormData($("#formUpload")[0]),
        processData: false,
        contentType: false,
        error: function (xhr) {
            status('Error: ' + xhr.status);
        },
        success: function (json) {
            console.log(json);

            if (json.result === true) {

                // send message type download
                alert(json.msg);
                window.location.href = window.location.href;

            }
            else {
                alert(json.msg);
            }
        }
    });
});




