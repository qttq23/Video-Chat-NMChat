

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




