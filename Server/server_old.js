var server = require("net").createServer();
var io = require('socket.io').listen(server);

// define interactions with client
io.sockets.on('connection', function(socket){
    //recieve data from client - from Arduino via Particle
    socket.on('arduino_sound', function(data){
	 // send data to client - to Android/Unity AR Device
	 console.log(data);
         // TODO - socket.emit('sound_location', analyze(data.mic1, data.mic2, data.mic3));
    });
});
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
