

document.write("text from main.js");




(function($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function() {

        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        //Check email match type
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    ///Get data
    //Get username $("#username").val()
    // Get password $("#password").val()
    $("#login-button").click(function() {
        var username = $("#username").val();
        var password = $("#password").val();
        alert(`${username} ${password}`);


        // check abcxyz


        // submit
        $.ajax({
            method: 'post',
            url: '/authen/login',
            data: {
                username: username,
                password: password
            }

        }).done(function (json) {
            console.log(json);

            if (json.result === true) {
                window.location.href = json.redirect;
                // server redirect to home
            }
            else {
                alert(json.msg);
            }
        });



        //Very important line, it disable the page refresh.
        return false;

    });


})(jQuery);

