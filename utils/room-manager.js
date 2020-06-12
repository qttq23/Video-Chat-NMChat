
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
            messages: [],
            config: {
                isVideo: true,   
                isMicro: true,
                isAudio: true
            }
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

            socket.on('create or join', function (room, userId) {
                log('Received request to create or join room ' + room);

                var clientsInRoom = io.sockets.adapter.rooms[room];
                var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
                log('Room ' + room + ' now has ' + numClients + ' client(s)');


                // after 2 seconds, check if room still exists
                var timeoutCheckRoomExists = () => {
                    setTimeout(function () {
                        let i;
                        for (i = 0; i < roomList.length; i++) {
                            if (roomList[i].roomName == socket.myRoom) {
                                console.log('room exists');
                                return;
                            }
                        }

                        // here means room was deleted
                        // force user out of room
                        console.log('room not exist, force leave');
                        socket.emit('room finished');
                    }
                        , 3000);
                };

                if (numClients === 0) {
                    log('Client ID ' + socket.id + ' created room ' + room);
                    
                    socket.leave(socket.id);
                    socket.join(room);
                    socket.emit('created', room, socket.id);
                    socket.myRoom = room;
                    socket.myId = userId;

                    // assign host for later check
                    let i;
                    for (i = 0; i < roomList.length; i++) {
                        if (roomList[i].roomName == socket.myRoom) {
                            socket.myHost = roomList[i].host;
                            break;
                        }
                    }

                    timeoutCheckRoomExists();

                } else if (1 <= numClients <= 3) {
                    log('Client ID ' + socket.id + ' joined room ' + room);

                    socket.leave(socket.id);
                    socket.join(room);
                    socket.emit('joined', room);

                    socket.myRoom = room;
                    socket.myId = userId;

                    timeoutCheckRoomExists();

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
                
                

                // check if just left is host
                let i;
                for (i = 0; i < roomList.length; i++) {
                    if (roomList[i].roomName == socket.myRoom 
                        && roomList[i].host == socket.myHost) {

                        
                        console.log('is host leave');
                        // host here
                        // force others to leave
                        socket.broadcast.in(socket.myRoom).emit('room finished');

                        // remove room info
                        roomList.pop(roomList[i]);

                        break;
                    }
                }

                socket.broadcast.in(socket.myRoom).emit('peer out', socket.id);
                socket.leave(socket.myRoom);
                socket.myRoom = null;
                socket.myHost = null;
                

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

                        // also sent list of configs
                        socket.emit('config', room.config);
                    }
                }

                

            });

            socket.on('kick', (userId)=>{

                // loop all client
                let room = io.sockets.adapter.rooms[socket.myRoom];
                let clients = room.sockets;

                console.log(room);

                for (var clientId in clients) {

                    //this is the socket of each client in the room.
                    var clientSocket = io.sockets.connected[clientId];

                    if (clientSocket.myId === userId){

                        console.log('found userId to kick');

                        // if match
                        // emit kick signal
                        clientSocket.emit('kicked');
                        break;
                    }


                }
            });

            socket.on('set config', (config) => {
                console.log('host set config');
                console.log(config);

                // store to config in room
                let i;
                for (i = 0; i < roomList.length; i++) {
                    if (roomList[i].roomName == socket.myRoom) {
                        roomList[i].config = config;
                    }
                }

                // broadcast to all in room
                socket.broadcast.in(socket.myRoom).emit('config', config);
            });

            socket.on('participants', ()=>{
                // loop all client
                let room = io.sockets.adapter.rooms[socket.myRoom];
                let clients = room.sockets;


                let listParticipants = [];
                for (var clientId in clients) {

                    //this is the socket of each client in the room.
                    var clientSocket = io.sockets.connected[clientId];

                    listParticipants.push(clientSocket.myId);
                }

                // send to requester
                socket.emit('participants', listParticipants);
            });

        });

    }

}