module.exports = {
	generateUsername,
	setJSONBody,
	logHeaders
}

// Flow Function To Generate Username
function generateUsername( userContext, events, done ) {
	const username = makeRandomStr( 10 );
	userContext.vars.username = username;
	return done();
}

// Helper Function For Randomization
function makeRandomStr( size ) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for( var i = 1; i <= size; i ++ ) {
		text += possible.charAt( Math.floor( Math.random() * possible.length ) );
	}
	return text;
}

// HTTP POST Before Function
function setJSONBody( requestParams, context, ee, next ) {
	return next();
}

// HTTP POST After Function
function logHeaders( requestParams, response, context, ee, next ) {
	if( response.body.error != undefined ) {
		console.log( 'Error: ' + response.body.error );
	} else if( response.body.id != undefined ) {
		console.log( 'Created customer or order record ID ' + response.body.id );
	} else if( response.body != undefined ) {
		console.log( response.body );
	} else {
		console.log( response );
	}
	return next();
}
