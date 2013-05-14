window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     
    })();

jQuery(document).ready(function($) {
	// connect to nodejs via socket.io
	var host = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
	var socket = io.connect(host);

	// false when not moving, a string representing a direction when we are. "forward|backward|left|right"
	var moveDirection = false;

	// updating
	var fps = 30;
	var then = new Date().getTime();

	function update() {
		requestAnimFrame(update);

		var now = new Date().getTime();
		var deltaTime = now - then;

		if(deltaTime > 1000/fps) {
			if(moveDirection) {
				socket.emit("move",moveDirection);
			}

			then = now;	// reset the counter so we maintain 30fps.
		}
	}

	requestAnimFrame(update);

	function touchStart(evt) {
		evt.preventDefault();
		moveDirection = $(this).attr("data-direction");
		return false;
	}

	function touchEnd(evt) {
		moveDirection = false;
		evt.preventDefault();
		return false;
	}

	// movement
	if(Modernizr.touch) {
		$("#steering a").on('touchstart',touchStart);
		$("#steering a").on('touchend',touchEnd);
		$("#steering a").on('touchcancel',touchEnd);
		$(window).on('touchend',touchEnd);
	}
	else {
		$("#steering a").on('mousedown',touchStart);
		$("#steering a").on('mouseup',touchEnd);
	}


	// sound
	$("#sound a").click(function(evt) {
		evt.preventDefault();
		socket.emit("playSound");
		return false;
	});
});