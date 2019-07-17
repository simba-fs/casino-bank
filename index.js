var webSocketServer = require('ws').Server;
var wsServer = new webSocketServer({port: 3000});
var routers = require('./routers.js');

var clients = [];

wsServer.on('connection', ws => {
	clients.push(ws);
	console.log('A connection');
	console.log(clients);

	ws.on('message', msg => {
		var data = JSON.parse(msg);
		console.table(data);
		
		routers(data, ws);
	});

	ws.on('close', () => {
		clients = clients.filter(item => item !== ws);
	});
});
