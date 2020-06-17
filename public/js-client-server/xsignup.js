
$('#formSignup').submit(function(){

    // gather information
    let username = $('#username').val();
    let password = $('#password').val();
    let repassword = $('#re-password').val();    
    let name = $('#name').val();
    console.log(username + ',' + password + ',' 
    + repassword + ',' + name);


    // pre-check
    // check email valid, repassword match password
    // ...
    if(repassword !== password){
        $('#divError').html('re-password doesnot match password');
        $('#divError').css('color', 'red');
        return false;
    }


    // send to server
    console.log('sending to server');
    // submit
    $.ajax({
        method: 'post',
        url: '/authen/signup',
        data: {
            username: username,
            password: password,
            name: name
        }

    }).done(function (json) {
        console.log(json);

        if (json.result === true) {
            alert('sign up successfully!');
            window.location.href = json.redirect;
            // server redirect to home
        }
        else {
            alert(json.msg);
        }
    });

    // display result


    return false;
});

