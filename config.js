var config = {};

config['http'] = {};
config['http'].port = process.env.PORT || 8080;

config['serial'] = {};
config['serial'].baudrate = 57600;
config['serial'].mac = "/dev/tty.usbmodem1421";
config['serial'].pi = '/dev/ttyACM0';
config['serial'].path = (process.argv.indexOf("arduinoMode=mac") > -1) ? config['serial'].mac : config['serial'].pi;

config['sounds'] = {};
config['sounds'].directory = __dirname + '/public/audio';

config['r2d2'] = {}; 
config['r2d2'].commands = {};
config['r2d2'].commands['forward'] = 'a';
config['r2d2'].commands['backward'] = 'b';
config['r2d2'].commands['left'] = 'c';
config['r2d2'].commands['right'] = 'd';

config['osc'] = {};
config['osc'].host = '127.0.0.1';
config['osc'].port = 30000;


module.exports = config;