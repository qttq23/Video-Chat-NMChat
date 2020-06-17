

$('#btnInvite').click(function(){

    let email = $('#edtInvite').val();
    
    // submit
    $.ajax({
        method: 'post',
        url: '/invite',
        data: {
            email: email
        }

    }).done(function (json) {
        console.log(json);

        if (json.result === true) {
            alert(json.msg);
        }
        else {
            alert(json.msg);
        }
    });


    //Very important line, it disable the page refresh.
    return false;


});

