
$('#btn-join-dialog').click(function () {

    // check abcxyz


    // submit
    $.ajax({
        method: 'post',
        url: '/room/create',
        data: {
            roomName: $('#meeting-id').val()
        }

    }).done(function (json) {
        console.log(json);

        if (json.result === true) {
            window.location.href = json.redirect;
        }
        else {
            alert(json.msg);
        }
    });



    //Very important line, it disable the page refresh.
    return false;
});


