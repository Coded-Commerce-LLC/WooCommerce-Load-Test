module.exports = {
	setJSONBody: setJSONBody,
	logHeaders: logHeaders
}

function setJSONBody( requestParams, context, ee, next ) {
	return next();
}

function logHeaders( requestParams, response, context, ee, next ) {
	if( response.body.error != undefined ) {
		console.log( 'Error: ' + response.body.error );
	} else if( response.body.id != undefined ) {
		console.log( 'Created order ' + response.body.id );
	} else {
		console.log( response );
	}
	return next();
}
