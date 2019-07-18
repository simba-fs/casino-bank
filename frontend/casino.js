var ws;

if(!('WebSocket' in window)){
	alert('your blowser doesn\'t support webSocket, please switch to chrome or firefox');
	$('input, button').attr('disabled', true);
}

$('#deposition-input, #withdrawal-input').val(1000).attr('step', 1000);
$('#deposition-button').click('deposition', sendData);
$('#withdrawal-button').click('withdrawal', sendData);
$('.disable').attr('disabled', true);

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
	};
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
			amount: $(`#${mode}-input`)
		};
		var json = JSON.stringify(data);
		ws.send(json);
	}else{
		return console.error(`in xfunction sendData, unknown mode: ${mode}`);
	}
}

