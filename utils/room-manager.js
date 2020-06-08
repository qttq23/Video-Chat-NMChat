
var roomList = [];

module.exports = {

    canCreate: (roomName) => {
        let i = 0;
        for (i = 0; i < roomList.length; i++) {
            if (roomList[i].roomName == roomName) {
                return false;
            }
        }

        return true;

    },

    canJoin: (roomName, participant) => {

        let i = 0;
        for (i = 0; i < roomList.length; i++) {
            if (roomList[i].roomName == roomName) {
                return true;
            }
        }

        return false;
    },

    create: (roomName, host) => {
        roomList.push({
            roomName: roomName,
            host: host,
            messages: []
        });

        
    },

    join: (roomName, client) => {

    },

    getRoomInfo: (roomId)=>{


        let i = 0;
        for(i = 0; i < roomList.length; i++){
            if (roomList[i].roomName == roomId) {
                return roomList[i];
            }
        }

        return null;
    },

    startSocketIO: () => {
        io.sockets.on('connection', function (socket) {


            socket.on('get id', (fn) => {
                console.log('a client request id: ' + socket.id);
                fn(socket.id);
            });

            socket.on('got user media', (data) => {
                console.log('a client ready');
                console.log(data);

                console.log('local room: ' + socket.myRoom);
                socket.broadcast.in(socket.myRoom).emit('got user media', data);
            });

            socket.on('offer', (data) => {
                console.log('a client send offer');
                // console.log(data);
               


                socket.broadcast.in(socket.myRoom).emit('offer', data);
            });

            socket.on('answer', (data) => {
                console.log('a client send answer');
                // console.log(data);
            
                socket.broadcast.in(socket.myRoom).emit('answer', data);
            });

            socket.on('candidate', (data) => {
                console.log('a client send candidate');
                // console.log(data);

                socket.broadcast.in(socket.myRoom).emit('candidate', data);
            });



            function log(msg) {
                console.log(msg);
            }

            socket.on('create or join', function (room) {
                log('Received request to create or join room ' + room);

                var clientsInRoom = io.sockets.adapter.rooms[room];
                var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
                log('Room ' + room + ' now has ' + numClients + ' client(s)');

                if (numClients === 0) {
                    log('Client ID ' + socket.id + ' created room ' + room);
                    
                    socket.leave(socket.id);
                    socket.join(room);
                    socket.emit('created', room, socket.id);
                    socket.myRoom = room;

                } else if (1 <= numClients <= 3) {
                    log('Client ID ' + socket.id + ' joined room ' + room);

                    // io.sockets.in(room).emit('join', room);
                    // socket.join(room);
                    // socket.emit('joined', room, socket.id);
                    // io.sockets.in(room).emit('ready');

                    socket.leave(socket.id);
                    socket.join(room);
                    socket.emit('joined', room);

                    socket.myRoom = room;
                    // socket.broadcast.in(room).emit('joined', room, socket.id);
                    // io.sockets.in(room).emit('ready');
                } else { // max two clients
                    socket.emit('full', room);
                }
            });

            socket.on('ipaddr', function () {
                console.log('on ipadrr');


                var ifaces = os.networkInterfaces();
                for (var dev in ifaces) {
                    ifaces[dev].forEach(function (details) {
                        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                            socket.emit('ipaddr', details.address);
                        }
                    });
                }
            });

            socket.on('disconnect', function () {
                console.log('a client disconnected');
                
                socket.leave(socket.myRoom);
                socket.myRoom = null;

                
            });


            socket.on('msg', (message) => {
                console.log('client sent msg');
                console.log(message);

                if(message.to === 'all'){
                    // store to list messages in room
                    let i;
                    for (i = 0; i < roomList.length; i++) {
                        if (roomList[i].roomName == socket.myRoom) {
                            roomList[i].messages.push(message);
                        }
                    }

                    // broadcast to all in room
                    console.log('broadcast msg');
                    socket.broadcast.in(socket.myRoom).emit('msg', message);
                }
                else{

                }
            });

            socket.on('get messages', ()=>{
                console.log('client get list messages');

                let i;
                for (i = 0; i < roomList.length; i++) {

                    let room = roomList[i];
                    if (room.roomName == socket.myRoom) {

                        console.log('found client room');
                        console.log('room now has ' + room.messages.length);

                        let k;
                        for(k = 0; k < room.messages.length; k++){
                            socket.emit('msg', room.messages[k]);
                        }
                    }
                }
            });

        });

    }

}