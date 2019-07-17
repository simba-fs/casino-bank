(function($){
	
	///// define class ///// 
	class Deposition{
		constructor(userName, amount){
			this.type = 'deposition';
			this.userName = userName;
			this.amount = amount;
			this.timestamp = (new Date()).getTime();
		}
		
		toString(){
			return JSON.stringify(this);
		}
	}
	class Withdrawal{
		constructor(userName, withdrawal){
			this.type = 'withdrawal';
			this.userName = userName;
			this.amount = amount;
			this.timestamp = (new Date()).getTime();
		}
		
		toString(){
			return JSON.stringify(this);
		}
	}
	
	///// open ws connection /////
	var wsServer = 'ws://localhost:3000';
	var ws = new WebSocket(wsServer);

	ws.onopen = function(e){
		console.log('Connection to server ' + wsServer);
	}

	ws.onmessage = function(event){
		///// output to console ///// 
		console.log('Received a message');
		console.log(event);

		//// handler /////
		var data = JSON.parse(event.data);
		if(event.data.type in req){
			req[event.data.type](data);
		}
	}
		
	///// handle data from server /////
	
	var handlers = {};

	handlers.deposition = function(data){
		if(data.type === 'error'){
			alert('ERROR: ' + data.error);
		}else{
			alert('Successed');
		}
	}

	handlers.withdrawal = function(data){
		if(data.type === 'error'){
			alert('ERROR: ' + data.error);
		}else{
			alert('Successed');
		}
	}

	handlers.update = function(data){
		console.log('update');
	}

	var req = {
		'deposition': handlers.deposition,
		'withdrawal': handlers.withdrawal,
		'update': handlers.update
	};

	function sendRequest(type){
		var data = {};
		var userName = '';
		var amount = '';
		if(type === 'deposition'){
			userName = $('#deposition-username').val();
			amount = $('#deposition-input').val();
			data = new Deposition(userName, amount);
		}else if(type === 'withdrawal'){
			userName = $('#withdrawal-username').val();
			amount = $('#withdrawal-input').val();
			data = new Deposition(userName, amount);
		}else{
			return;
		}

		var json = data.toString();
		ws.send(json);
	}

	$('#deposition-button').click('deposition', sendRequest);
	$('#withdrawal-button').click('withdrawal', sendRequest);
})($);
