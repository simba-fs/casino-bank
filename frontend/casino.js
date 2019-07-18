var ws;

if(!('WebSocket' in window)){
	alert('your blowser doesn\'t support webSocket, please switch to chrome or firefox');
	$('input, button').attr('disabled', true);
}

$('#deposition-input, #withdrawal-input').val(1000).attr('step', 1000);
$('#deposition-button').click(deposition);
$('#withdrawal-button').click(withdrawal);
$('.disable').attr('disabled', true);
///// SEND DATA /////
function deposition(){
	sendData('deposition');
}

function withdrawal(){
	sendData('withdrawal');
}

$('#connect').click(() => {
	var url = $('#url').val() || 'ws://localhost:1234';
	ws = new WebSocket(url);
	
	ws.onopen = function(){
		console.log('connected to ' + url);
		$('.enable').attr('disabled', true);
		$('.disable').attr('disabled', false);
	};

	ws.onclose = function(){
		console.log('connection closed');
		$('.enable').attr('disabled', false);
		$('.disable').attr('disabled', true);
		$('#bank').empty();
	};

	ws.onmessage = receive;
});

function sendData(mode){
	var username = $('#username').val();
	if(!username){
		alert('ERROR!! userName missed !!');
		return console.error('ERROR!! userName missed !!');
	}
	if(mode === 'deposition' || mode === 'withdrawal'){
		var data = {
			type: mode,
			userName: username,
			amount: parseInt($(`#${mode}-input`).val())
		};
		console.info('request:');
		console.info(data);
		var json = JSON.stringify(data);
		ws.send(json);
	}else{
		return console.error(`in function sendData, unknown mode: ${mode}`);
	}
}

///// RECEIVE DATA /////

function receive(event){
	console.log('receive data');

	var data = JSON.parse(event.data)
	console.log(data);

	switch(data.type){
		case 'update': 
			update(data);
			break;
		case 'error':
			error(data);
			break;
		default:
			error(data);
	}
}

var tmp;

function update(data){
	var table = $('#bank');
	var template = '<tr><td>.userName.</td><td>.money.</td></tr>';
	tmp = data;
	table.empty().attr('border', 1);
	table.append(template.
		replace(/.userName./, 'name').
		replace(/.money./, 'money'));
	for(var i in data.data){
		var user = data.data[i];
		var tr = template.
			replace(/.userName./, user.name).
			replace(/.money./, user.money);
		table.append(tr);
	}
}

function error(data){
	alert(data);
}
