/**
* This code is a piece of sh*t but I think it works if you have like 1 hour to mount this and a Raspberry PI to work
* as an HTTP server or integrate it somewhere, don't know, I just did this for fun and because I was learning 
*/
const wol = require('wol');
const LGTV = require("lgtv2");
const fs = require('fs');

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let adapter = {
	config: {
		ip: '', // The IP of your LGTV
		mac: '' // The mac address of your LGTV (you need to get this manually)
	}
};

let isConnect = false;
let isTurnedOn = false;

const token = ''; // Token for security here :) so nobody can just execute the API without the token
// Just add a random string :P

let lgtvobj;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sendCommand = (cmd, options, cb) => {
    if (isConnect){
        sendPacket(cmd, options, (_error, response) => {
            cb && cb(_error, response);
        });
    }
};

const sendPacket = (cmd, options, cb) => {
    if (~cmd.indexOf('ssap:') || ~cmd.indexOf('com.')){
        lgtvobj.request(cmd, options, (_error, response) => {
            if (_error){
                console.log('ERROR! Response from TV: ' + (response ? JSON.stringify(response) :_error));
            }
            cb && cb(_error, response);
        });
    } else {
        lgtvobj.getSocket('ssap://com.webos.service.networkinput/getPointerInputSocket', (err, sock) => {
            if (!err){
                sock.send(cmd, options);
            }
        });
    }
};

const connect = () => {
	lgtvobj = new LGTV({
		url: 'ws://' + adapter.config.ip + ':3000',
		timeout: 15000,
		reconnect: 5000
	});
	
	lgtvobj.on('connecting', (host) => {
		if(isTurnedOn === false) {
			console.log('Trying to turn on the TV and then connect');
			run('tv.on');
		}
		
		if(isConnect === false) {
			console.log('Connecting to WebOS TV: ' + host);
			isConnect = false;
		}
    });

    lgtvobj.on('close', (e) => {
        console.log('Connection closed: ' + e);
		isConnect = false;
    });

    lgtvobj.on('prompt', () => {
        console.log('Waiting for pairing confirmation on WebOS TV ' + adapter.config.ip);
		isConnect = false;
    });

    lgtvobj.on('error', (error) => {
        console.log('Error on connecting or sending command to WebOS TV: ' + error);
		isConnect = false;
    });

    lgtvobj.on('connect', (error, response) => {
        console.log('WebOS TV Connected');
        isConnect = true;
	});
};

const run = (cmd) => {
	if (cmd){
		console.log('Running command: ' + cmd);
		
		switch (cmd) {
			case 'tv.off':
				console.log('Sending turn OFF command to WebOS TV: ' + adapter.config.ip);
				sendCommand('ssap://system/turnOff', {message: 'Power off'}, (err, val) => {
					if (!err) {
						console.log('TV turned Off');
						isTurnedOn = false;
					}
				});
				break;
			case 'tv.on':
				console.log('Sending turn ON command to WebOS TV: ' + adapter.config.ip);
				if(adapter.config.mac !== '') {
					wol.wake(adapter.config.mac, (err, res) => {
						if (!err) { 
							console.log('TV turned ON');
							isTurnedOn = true;
						}
					});
				} else {
					console.log('Error sending the WOL command maybe MAC is not set yet');
				}
				break;


			default:
				console.log('Command not available');
				break;
		}
	}
};

app.listen(3000, function () {
	if(isConnect === false) {
		connect();
	}
    console.log("Server on: 3000");
});

app.get('/', function(req, res) {
	res.send({ error: 'access prohibited' });
});

app.get('/turn-on', function(req, res) {
	const queryToken =  req.query.token;
	if(token !== queryToken) {
		res.send({ error: 'access prohibited' });
	}
	
	run('tv.on');
	console.log('On executed');
	res.send({ message: 'executed on' });
});

app.get('/turn-off', function(req, res) {
	const queryToken =  req.query.token;
	if(token !== queryToken) {
		res.send({ error: 'access prohibited' });
	}
	
	run('tv.off');
	console.log('Off executed');
	res.send({ message: 'executed off' });
});
