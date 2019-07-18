///// setup port number /////
var port = 8080;

///// create ws server /////
var webSocketServer = require('ws').Server;
var wsServer = new webSocketServer({port: port});

///// import router /////
var routers = require('./routers.js');

///// storage all commection /////
var clients = [];

wsServer.on('connection', ws => {
	///// add one connection /////
	clients.push(ws);
	
	console.log('a new connection');
	
	ws.on('message', msg => {
		var data = JSON.parse(msg);
		routers(data, ws, clients);
	});

	ws.on('close', () => {
		clients = clients.filter(item => item !== ws);
	});
});

module.exports.clients = clients;
