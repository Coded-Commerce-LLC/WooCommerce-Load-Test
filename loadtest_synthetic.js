
module.exports = { beforeRequest, afterResponse, runTest }

const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );
process.setMaxListeners( 0 );

async function beforeRequest( requestParams, context, ee, next ) {
	return next();
}

async function afterResponse( requestParams, response, context, ee, next ) {
	return next();
}

async function runTest( context, events, next ) {

	// Try Catch
	try {

		// Start Counter
		var counter_start = new Date();
		var counter_start_ms = ( counter_start.getTime() + '.' + counter_start.getMilliseconds() );

		// Open Browser
		context.browser = await puppeteer.launch( { headless: true } );
		context.page = await context.browser.newPage();
		await context.page.setViewport( { width: 1280, height: 1280 } )
		await context.page.goto( 'https://dev-sean-sandbox.pantheonsite.io/', {
			timeout: 10000000
		} );
		await context.page.setRequestInterception( false );

		// Click Add To Cart Button
		await context.page.waitForSelector( "a[data-product_id='36']" );
			//await context.page.screenshot( { path: 'step1-home.png', fullPage: true } );
		await context.page.click( "a[data-product_id='36']" );

		// Click View Cart Button
		await context.page.waitForSelector( 'a.added_to_cart' );
			//await context.page.screenshot( { path: 'step2-added-to-cart.png', fullPage: true } );
		await context.page.click( 'a.added_to_cart' );

		// Click Checkout Button
		await context.page.waitForSelector( 'a.checkout-button' );
			//await context.page.screenshot( { path: 'step3-cart.png', fullPage: true } );
		await context.page.click( 'a.checkout-button' );

		// Checkout Page Loaded
		await context.page.waitForSelector( 'button#place_order' );

		// Complete Checkout Form
		await context.page.type( 'input#billing_first_name', 'First Name' );
		await context.page.type( 'input#billing_last_name', 'Last Name' );
		await context.page.type( 'input#billing_address_1', '12345 Test St.' );
		await context.page.type( 'input#billing_city', 'Los Angeles' );
		await context.page.type( 'input#billing_postcode', '91307' );
		await context.page.type( 'input#billing_phone', '111-222-3333' );
		await context.page.type( 'input#billing_email', 'sean@codedcommerce.com' );

		// Complete Payment Method
		await context.page.click( "label[for='payment_method_cod']" );

		// State Drop Down
		await context.page.click( "label[for='billing_state']" );
		await context.page.type( "label[for='billing_state']", 'California' + String.fromCharCode( 13 ) );

		// Wait For AJAX Refresh
		await context.page.evaluate(() => {
			let dom = document.querySelector( 'tr.order-total span.amount' );
			dom.parentNode.removeChild( dom );
		} );
		await context.page.waitForSelector( 'tr.order-total span.amount' );
			//await context.page.screenshot( { path: 'step5-checkout.png', fullPage: true } );

		// Submit Checkout
		await context.page.click( 'button#place_order' );

		// Order Receipt
		await context.page.waitForSelector( 'li.order' );
		context.vars.order_number = await context.page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);
			//await context.page.screenshot( { path: 'step6-order.png', fullPage: true } );

		// Close Browser
		await context.browser.close();

		// End Counter
		var counter_stop = new Date();
		var counter_stop_ms = ( counter_stop.getTime() + '.' + counter_stop.getMilliseconds() );
		context.vars.lapsed = counter_stop_ms - counter_start_ms;

	// Catch Errors
	} catch( error ) {
		console.log( 'ERROR with sequence ' + context.vars.name + ' quantity ' + context.vars.quantity + ': ' + error );
	}

	// Return
	return next();
}
