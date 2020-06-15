
$(()=>{

    getListHistoriesAndDisplay();

});

function getListHistoriesAndDisplay() {

    $.ajax({
        method: 'get',
        url: '/history/all',

    }).done(function (json) {
        console.log(json);

        // append to list friends
        $('#txtHistories').html('');
        for (i = 0; i < json.histories.length; i++) {
            let history = json.histories[i];
            let html = `
            <tr>
            <td>${history.joinTime}</td>
            <td>${history.leaveTime}</td>
            <td>${history.roomName}</td>
            <td scope="row">${history.hostName}</td>
            </tr>
            `;

            $('#txtHistories').append(html);
        }
    });

}

