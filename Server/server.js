var server = require("net").createServer();
var io = require('socket.io').listen(server);

var PORT = 8888;
var HOST = '45.79.129.160';

var dgram = require('dgram');
var udpserver = dgram.createSocket('udp4');

udpserver.on('listening', function () {
    var address = udpserver.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

udpserver.on('message', function (message, remote) { // arduino sent us a message via UDP
    console.log(remote.address + ':' + remote.port +' - ' + message);
    // send out socket message, which the AR unity/android device will get
    io.sockets.on('connection', function(socket){
        console.log(message);
	socket.emit('location', analyze(message[0], message[1], message[2]));
    });

});

udpserver.bind(PORT, HOST);

// TODO - use this function
// returns either 0, 1, or 2, representing the 2D location of the sound (left, front, right)
function analyze(mic1, mic2, mic3){
    switch(Math.min(mic1, mic2, mic3)) {
	case mic1:
	    return 0;
	case mic3:
	    return 2;
	default:
	    return 1;
    }
}
