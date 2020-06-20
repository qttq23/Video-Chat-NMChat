$('#myfile').on('change', function(e){

    // check file size limit
    console.log(config.MaxFileSizeUpload);

    let file = e.currentTarget.files[0];
    console.log(file);
    if (file.size > config.MaxFileSizeUpload) {
        let sizeInMB = config.MaxFileSizeUpload / (1024*1024);
        alert(`Maximum file size is ${sizeInMB} MB`);
        $('#myfile').val('');
        
    }
});

// < !--form upload-- >
$('#formUpload').submit(function () {
    // check abcxyz
    //...
    if($('#myfile').get(0).files.length === 0){
        alert('No file was choosen');
        return false;
    }

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
                let content = `<a href="${json.path}" title="click to download" download>${json.filename}</a>`;
                    // + `  (<a href="${json.path}" title="click to download" download>download</a>)`;
                
                if(isImage(json.filename) === true){
                    content += `<div>
                    <a href="${json.path}" title="click to view large image"  target="_blank">
                    <img src="${json.path}" alt="small image" style="width:200px;height:200px;">
                    </a>
                    </div>`;
                }

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



function isImage(filename){
    let name = filename.toLowerCase();
    // if (name.match(/.(jpg|jpeg|png|gif|tif|tiff|bmp|)$/i)){
    if ((/\.(gif|jpg|jpeg|tiff|png|webp|bmp)$/i).test(name)){
        return true;
    }
    return false;
}

