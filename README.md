	            .-""-.
	           /[] _ _\
	          _|_o_LII|_
	         / | ==== | \
	         |_| ==== |_|
	          ||" ||  ||
	          ||LI  o ||
	          ||'----'||
	         /__|    |__\


R2D2 Controller
===========
Controller for YesYesNo's R2D2 machine. Runs off of a Raspberry Pi, creates a local webserver that a user can access via their mobile phone to control the direction of the R2 unit.

Installing NodeJS on a Pi
-------
[Check this tutorial](http://www.slickstreamer.info/2013/02/how-to-install-nodejs-on-raspberry-pi.html).

I recommend prebuilt over compiling from source as compilation time is > 2 hours.

Recommended Directory on the Pi
--------
These files can run from anywhere on the Pi but for our purposes we basically copied the source from this repo into the following directory:

	~/r2d2

Installing Dependancies
-------
Once NodeJS is installed, you'll need to install all appropriate dependancies run the following commands:

	sudo apt-get install libasound2-dev
	cd ~/r2d2
	/usr/local/bin/npm install

This may take awhile to download and build. As of this writing this application uses the following NodeJS packages:

* **node-osc** for communicating with... something to play sounds.
* **express** for serving the web page up.
* **socket.io** for creating a persistant connection from web page to Pi.
* **node-serialport** for serial communication to the Arduino
* **node-lame** and **node-speaker** for playing sounds (replaced by node-osc)

Running the server
-------
	/usr/local/bin/node /home/pi/r2d2/app.js

Then you should be able to hit http://r2d2.local:8080 and see it running.

Command Line Arguments
--------
If testing on a Mac you can say:

	node app.js arduinoMode=mac

And this will use a different serial port than the Pi's /dev/ttyACM0. Check the config.js file for more on that.

The config.js file
-------
Most everything in there is pretty straightforward - just paths to hosts and ports and baudrates and what have you. 

The web page passes directions as strings that are then sent via serial as characters:

	* "forward" becomes "a"
	* "backwards" becomes "b"
	* etc, etc

These mappings are also in the config.