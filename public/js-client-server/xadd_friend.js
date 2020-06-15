

$(()=>{


    getListFriendsAndDisplay();

});

function getListFriendsAndDisplay(){

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
            <tr>
            <td>${friend.email}</td>
            <td>${friend.name}</td>
            </tr>
            `;

            $('#txtFriends').append(html);
        }
    });

}


$('#btnAddFriend').click(function(){

    let emailToAdd = $('#txtFriendEmail').val();
    console.log(emailToAdd);

    $.ajax({
        method: 'post',
        url: '/friend/add',
        data: {
            friendEmail: emailToAdd
        }

    }).done(function (json) {
        console.log(json);

        if (json.result === true) {
            alert('add friend successfully!');
            getListFriendsAndDisplay();
        }
        else {
            alert(json.msg);
        }
    });


    return false;
});

