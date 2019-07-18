var casino = require('./app.js');

function deposition(data, ws, clients){
	var err = casino.deposit(data.userName, data.amount);
	update(clients);
}

function withdrawal(data, ws, clients){
	var err = casino.withdrawal(data.userName, data.amount);
	if(err){
		var json = JSON.stringify(err);
		ws.send(json);
	}else{
		update(clients);
	}
}
function errorType(data, ws, clients){
	var data = {
		type: 'error',
		errorCode: 102
	};
	var json = JSON.stringify(data);
	ws.send(json);
}

///// update all client /////

function update(clients){
	var json = JSON.stringify({
		type: 'update',
		data: casino.bank
	});
	console.log(clients.length);
	clients.forEach(item => {
		item.send(json);
	});
}

///// export function /////
module.exports.deposition = deposition;
module.exports.withdrawal = withdrawal;
module.exports.errorType = errorType;
module.exports.update = update;
