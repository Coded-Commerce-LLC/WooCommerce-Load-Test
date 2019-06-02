
// Test Site
const test_url = 'https://dev-accelerated-store-demo.pantheonsite.io';

// Exports
module.exports = { runTest }

// Include Puppeteer
const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );

// Increase Event Listeners
process.setMaxListeners( 0 );

// Test Function
async function runTest( context, events, next ) {

	// Start Counter
	var counter_start = new Date();
	var counter_start_ms = ( counter_start.getTime() + '.' + counter_start.getMilliseconds() );
	context.vars.counter_start_ms = counter_start_ms;
	const browser = await puppeteer.launch( { headless: true } );
	const page = await browser.newPage();
	const payload_qty = context.vars.quantity.toString();
	const payload_productid = context.vars.product_id;
	const payload_name = context.vars.name;
	await page.setViewport( { width: 1280, height: 1280 } )

	try {

		// Adding To Cart
		console.log( '1 - Adding To Cart & Redirecting Checkout' );
		await page.goto( test_url + '/checkout/?add-to-cart=' + payload_productid, { 'waitUntil' : 'networkidle0', timeout: 0 } );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Checkout Form
		console.log( '2 - Completing Checkout Form Fields' );
		await page.evaluate( ( payload_name ) => { document.querySelector( 'input#billing_email' ).value = payload_name + '@codedcommerce.com' }, payload_name );
		await page.evaluate( ( payload_name ) => { document.querySelector( 'input#billing_first_name' ).value = payload_name }, payload_name );
		await page.evaluate( ( payload_name ) => { document.querySelector( 'input#billing_last_name' ).value = payload_name }, payload_name );
		await page.evaluate( () => { document.querySelector( 'input#billing_address_1' ).value = '12345 Test St.' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_city' ).value = 'Los Angeles' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_postcode' ).value = '91307' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_phone' ).value = '111-222-3333' } );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// State Drop Down
		console.log( '3 - Selecting State Drop Down' );
		await page.select( 'select#billing_state', 'CA' );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Payment Method
		await page.waitFor( 1000 );
		console.log( '4 - Selecting COD Payment' );
		await page.click( "label[for='payment_method_cod']" );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Submit Checkout
		await page.waitFor( 1000 );
		console.log( '5 - Clicking Place Order Button' );
		await page.click( 'button#place_order' );
		await page.waitForSelector( 'li.order', { timeout: 0 } );

		// Order Receipt
		console.log( '6 - Parsing Order Receipt' );
		context.vars.order_number = await page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);
		console.log( '7 - Order placed: ' + context.vars.order_number.trim() );

		// Screen Shot
		//await page.screenshot( { path: order_number.trim() + '.png', fullPage: true } );

	// Catch Errors
	} catch( err ) {
		console.log( err );
		await page.screenshot( { path: 'error-' + context.vars.counter_start_ms + '.png', fullPage: true } );
	}

	// Close Browser
	await browser.close();

	// End Counter
	var counter_stop = new Date();
	var counter_stop_ms = ( counter_stop.getTime() + '.' + counter_stop.getMilliseconds() );
	context.vars.lapsed = Math.round( counter_stop_ms - counter_start_ms );

	// Process Latency
	events.emit( 'histogram', 'HeadlessChromiumLatency', context.vars.lapsed );

	// Return
	return next();
}
