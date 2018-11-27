
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
		await context.page.goto( 'https://dev-sean-sandbox.pantheonsite.io/shop/', { timeout: 100000 } );
		await context.page.setRequestInterception( false );

		// Click Add To Cart Button
		await context.page.waitForSelector( "a[data-product_id='" + context.vars.product_id + "']" );
			//await context.page.screenshot( { path: 'step1-home.png', fullPage: true } );
		await context.page.click( "a[data-product_id='" + context.vars.product_id + "']" );

		// Click View Cart Button
		await context.page.waitForSelector( 'a.added_to_cart' );
			//await context.page.screenshot( { path: 'step2-added-to-cart.png', fullPage: true } );
		await context.page.click( 'a.added_to_cart' );

		// Set Quantity
		await context.page.waitForSelector( 'input.qty' );
		await context.page.evaluate( () => { document.querySelector( 'input.qty' ).value = '' } );
		await context.page.type( 'input.qty', context.vars.quantity );
		await context.page.waitForSelector( "button[name='update_cart']" );
		await context.page.click( "button[name='update_cart']" );
			//await context.page.screenshot( { path: 'step3-cart-qty.png', fullPage: true } );

		// Click Checkout Button
		await context.page.waitForSelector( 'a.checkout-button' );
		await context.page.click( 'a.checkout-button' );

		// Checkout Page Loaded
		await context.page.waitForSelector( 'button#place_order' );

		// Complete Checkout Form
		await context.page.type( 'input#billing_first_name', 'Bill First Name ' + context.vars.name );
		await context.page.type( 'input#billing_last_name', 'Bill Last Name ' + context.vars.name  );
		await context.page.type( 'input#billing_address_1', '12345 ' + context.vars.name + ' St.' );
		await context.page.type( 'input#billing_address_2', 'Apt ' + context.vars.name );
		await context.page.type( 'input#billing_city', 'Los Angeles' );
		await context.page.type( 'input#billing_postcode', '91307' );
		await context.page.type( 'input#billing_phone', '111-222-3333' );
		await context.page.type( 'input#billing_email', context.vars.name + '@codedcommerce.com' );

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
		await context.page.waitForSelector( 'tr.order-total span.amount', { timeout: 100000 } );
			//await context.page.screenshot( { path: 'step4-checkout.png', fullPage: true } );

		// Submit Checkout
		await context.page.click( 'button#place_order' );

		// Order Receipt
		await context.page.waitForSelector( 'li.order', { timeout: 100000 } );
		context.vars.order_number = await context.page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);
			//await context.page.screenshot( { path: 'step5-order.png', fullPage: true } );

		// Close Browser
		await context.browser.close();

		// End Counter
		var counter_stop = new Date();
		var counter_stop_ms = ( counter_stop.getTime() + '.' + counter_stop.getMilliseconds() );
		context.vars.lapsed = Math.round( counter_stop_ms - counter_start_ms );

		// Process Latency
		events.emit( 'histogram', 'HeadlessChromiumLatency', context.vars.lapsed );

	// Catch Errors
	} catch( error ) {
		console.log( 'ERROR with sequence ' + context.vars.name + ' quantity ' + context.vars.quantity + ': ' + error );
	}

	// Return
	return next();
}
