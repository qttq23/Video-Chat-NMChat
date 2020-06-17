
function insertEmailToInput(email){
    $('#edtInvite').val(email);
}

$('#btnInviteDialog').click(function(){

    $.ajax({
        method: 'get',
        url: '/friend/all',

    }).done(function (json) {
        console.log(json);

        // append to list friends
        $('#txtFriends').html('');
        for (i = 0; i < json.friends.length; i++) {
            let friend = json.friends[i];
            let html = `
            <tr onclick="insertEmailToInput('${friend.email}');">
            <td>${friend.name}</td>
            <td>${friend.email}</td>
            </tr>
            `;

            $('#txtFriends').append(html);
        }
    });

});

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

