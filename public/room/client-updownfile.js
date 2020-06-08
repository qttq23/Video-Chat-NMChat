

// < !--form upload-- >
$('#formUpload').submit(function () {



    // check abcxyz
    //...

    // submit
    $(this).ajaxSubmit({
        error: function (xhr) {
            status('Error: ' + xhr.status);
        },
        success: function (json) {
            console.log(json);

            if (json.result === true) {

                // send message type download
                alert(json.msg);
            }
            else {
                alert(json.msg);
            }
        }
    });


    //Very important line, it disable the page refresh.
    return false;
});

