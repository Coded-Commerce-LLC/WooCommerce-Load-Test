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
	} else {
		console.log( 'Created order ' + response.body.order.id );
	}
	return next();
}
