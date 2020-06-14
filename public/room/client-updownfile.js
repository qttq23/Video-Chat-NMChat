

// < !--form upload-- >
$('#formUpload').submit(function () {
    // check abcxyz
    //...

    // submit
    $.ajax({
        type: 'POST',
        url: "/room/upload",
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

                // append new message to others
                let content = `<a href="${json.path}" download>${json.filename}</a>`;
                let message = {
                    from: userName,
                    to: 'all',
                    type: 'html',
                    content: content
                }
                socket.emit('msg', message);

                // update local messages
                $(txtMessages).append('<br>' + '<b>you: </b>' + content);
                $(input_message).val('');
            }
            else {
                alert(json.msg);
            }
        }
    });


    //Very important line, it disable the page refresh.
    return false;
});




