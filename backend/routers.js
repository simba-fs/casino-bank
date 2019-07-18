var handlers = require('./handlers.js');
var handler = {
	deposition: handlers.deposition,
	withdrawal: handlers.withdrawal, 
	errorType: handlers.errorType 
}

function router(data, ws, clients){
	if(data.type in handler){
		handler[data.type](data, ws, clients);
	}else{
		handler.errorType(data, ws, clients);
	}
}

module.exports = router;
