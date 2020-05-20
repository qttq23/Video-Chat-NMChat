
module.exports = {

    canCreate: (roomName) => {

    },

    canJoin: (roomName) => {

    },

    create: (roomName, host) => {

    },

    join: (roomName, client) => {

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
                socket.broadcast.emit('got user media', data);
            });

            socket.on('offer', (data) => {
                console.log('a client send offer');
                console.log(data);
                socket.broadcast.emit('offer', data);
            });

            socket.on('answer', (data) => {
                console.log('a client send answer');
                console.log(data);
                socket.broadcast.emit('answer', data);
            });

            socket.on('candidate', (data) => {
                console.log('a client send candidate');
                console.log(data);
                socket.broadcast.emit('candidate', data);
            });



            // convenience function to log server messages on the client
            function log(msg) {
                // var array = ['Message from server:'];
                // array.push.apply(array, arguments);
                // socket.emit('log', array);

                console.log(msg);
            }


            socket.on('create or join', function (room) {
                log('Received request to create or join room ' + room);

                var clientsInRoom = io.sockets.adapter.rooms[room];
                var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
                log('Room ' + room + ' now has ' + numClients + ' client(s)');

                if (numClients === 0) {
                    socket.join(room);
                    log('Client ID ' + socket.id + ' created room ' + room);
                    socket.emit('created', room, socket.id);

                } else if (numClients === 1 || numClients == 2) {
                    log('Client ID ' + socket.id + ' joined room ' + room);
                    io.sockets.in(room).emit('join', room);
                    socket.join(room);
                    socket.emit('joined', room, socket.id);
                    io.sockets.in(room).emit('ready');
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

            socket.on('bye', function () {
                console.log('received bye');
            });

        });

    }

}