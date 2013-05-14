console.log("--------------------------------");
console.log("------------ R2D2 --------------");
console.log("--------------------------------");

console.log("");
console.log("            .-\"\"-.");
console.log("           /[] _ _\\");
console.log("          _|_o_LII|_");
console.log("         / | ==== | \\");
console.log("         |_| ==== |_|");
console.log("          ||\" ||  ||");
console.log("          ||LI  o ||");
console.log("          ||'----'||");
console.log("         /__|    |__\\");

var fs = require("fs");
var config = require(__dirname + "/config");

// http server init
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// websocket init
var io = require('socket.io').listen(server);

io.configure(function() { 
	io.set("log level", 0); // debugging
});

// serial init
var bSerialReady = false;

var serialport;

function connectToSerialPort() {
	if(bSerialReady) {
		console.log("[FATAL] :: Don't connect to the serial when we're already connected, dummy!");
		return;
	}

	console.log("Attempting to connect to serial :: " + config['serial'].path + " at baud :: " + config['serial'].baudrate);
	console.log("--------------------------------");

	serialport = new (require("serialport").SerialPort)(
		config['serial'].path, {
			baudrate: config['serial'].baudrate
	});

	serialport.on("open", function () {
		bSerialReady = true;
		console.log("Serial communication ready.");
		console.log("--------------------------------");

		serialport.on('data', function(data) {
			console.log('data received: ' + data);
		});  
	});

	serialport.on("error",function(err) {
		console.log("[FATAL] :: Error connecting to serial port.");
		console.log("" + err);
		console.log("--------------------------------");
	});

}
connectToSerialPort();

// osc init
var osc = new (require('node-osc').Client)(config['osc'].host, config['osc'].port);
console.log("Sending OSC messages to :: " + config['osc'].host + ":" + config['osc'].port);


// ------------------------------------------------------
// sound
var audioFiles = [];
fs.readdir(config['sounds'].directory, function(err,list) {
	if(err) {
		console.log("[FATAL] :: " + err);
		console.log("Sound will not play as a result.");
		return;
	}

	console.log("Loading audio files...");
	console.log(list.length + " files found.");

	for(var i=0;i<list.length;i++) {
		var filename = list[i];

		if(filename != ".DS_Store") {
			audioFiles.push(__dirname + "/" + config['sounds'].directory + "/" + list[i]);		
		}
	}

	console.log("Audio added and ready!");
	console.log("--------------------------------");
});


var lame = require('lame');
var speaker = require('speaker');

var playSound = function(filename) {
	console.log("Playing sound :: " + filename);

	// sends the sound name over OSC now.
	osc.send("/playSound",filename);

	// uncomment to ues the Sound class. Was buggy at last check.
	// fs.createReadStream(filename).pipe(new lame.Decoder()).on('format', function (format) {
	// 	this.pipe(new speaker(format));
	// });
}

var playRandomSound = function() {
	var mp3 = audioFiles[Math.floor(Math.random()*audioFiles.length)];
	playSound(mp3);
}

// ------------------------------------------------------
// http server
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.configure(function() {
 	app.use(express.static(__dirname + '/public'));
 	app.use(express.directory(__dirname + '/public'));
	app.use(express.errorHandler());
});

// ------------------------------------------------------
// socket server
io.sockets.on('connection', function (socket) {
	socket.on('move',function(direction) {
		console.log("Move message received. Direction :: " + direction);

		// to do :: move the thing
		if(bSerialReady) {
			var command = false;

			if(!config['r2d2'].commands[direction]) {
				console.log("[FATAL] :: Unknown direction!");
			}
			else {
				console.log("Sending over the serial :: " + config['r2d2'].commands[direction]);

				// sends the command over the serial port
				serialport.write(config['r2d2'].commands[direction], function(err, results) {
					if(err) console.log("[FATAL] :: " + err);				
				});
			}
		}
		else {
			console.log("Serial Port isn't ready yet. Attempting to connect...");
			connectToSerialPort();
		}

		console.log("--------------------------------");
	});

	socket.on("playSound",function() {
		console.log("Play Sound message received.");
		playRandomSound();
		console.log("--------------------------------");
	});
});

// ------------------------------------------------------
// startup
server.listen(config['http'].port);

console.log("--------------------------------");
console.log("--------------------------------");
console.log("--------------------------------");
console.log("Listening on port " + config['http'].port);
console.log("Open up http://r2d2.local:" + config['http'].port + "/ to control our favorite droid.");
console.log("--------------------------------");
