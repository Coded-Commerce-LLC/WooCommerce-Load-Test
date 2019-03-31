
// Test Site
const test_url = 'https://demo.acceleratedstore.com/shop/';

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

	// Try Catch
	try {

		// Open Browser
		context.browser = await puppeteer.launch( { headless: true } );
		context.page = await context.browser.newPage();
		await context.page.setViewport( { width: 1280, height: 1280 } )

		// Hit URL
		await context.page.goto( test_url, { 'waitUntil' : 'networkidle0' } );
		await context.page.waitForSelector( "a[data-product_id='" + context.vars.product_id + "']" );

		// Click Add To Cart Button
		await context.page.click( "a[data-product_id='" + context.vars.product_id + "']" );
		await context.page.waitForSelector( 'a.added_to_cart' );

		// Click View Cart Button
		await context.page.click( 'a.added_to_cart' );

		// Set Quantity (AJAX)
		await context.page.waitForSelector( 'input.qty' );
		await context.page.evaluate( () => { document.querySelector( 'input.qty' ).value = '' } );
		await context.page.type( 'input.qty', context.vars.quantity.toString() );
		await context.page.waitForSelector( "button[name='update_cart']" );
		await context.page.click( "button[name='update_cart']" );

		// Wait For AJAX Refresh
		await context.page.waitFor( 3000 );

		// Click Checkout Button
		await context.page.click( 'a.checkout-button' );

		// Wait For AJAX Refresh
		await context.page.waitFor( 3000 );

		// Checkout Page Loaded
		await context.page.waitForSelector( 'button#place_order' );

		// Complete Checkout Form (AJAX)
		await context.page.type( 'input#billing_first_name', 'Bill First Name ' + context.vars.name );
		await context.page.type( 'input#billing_last_name', 'Bill Last Name ' + context.vars.name  );
		await context.page.type( 'input#billing_address_1', '12345 ' + context.vars.name + ' St.' );
		await context.page.type( 'input#billing_address_2', 'Apt ' + context.vars.name );
		await context.page.type( 'input#billing_city', 'Los Angeles' );
		await context.page.type( 'input#billing_postcode', '91307' );
		await context.page.type( 'input#billing_phone', '111-222-3333' );
		await context.page.type( 'input#billing_email', context.vars.name + '@codedcommerce.com' );

		// Wait For AJAX Refresh
		await context.page.waitFor( 3000 );

		// Complete Payment Method (AJAX)
		await context.page.click( "label[for='payment_method_cod']" );

		// State Drop Down (AJAX)
		await context.page.click( "label[for='billing_state']" );
		await context.page.type( "label[for='billing_state']", 'California' + String.fromCharCode( 13 ) );

		// Wait For AJAX Refresh
		await context.page.waitFor( 3000 );

		// Submit Checkout
		await context.page.click( 'button#place_order' );

		// Order Receipt
		await context.page.waitForSelector( 'li.order' );
		context.vars.order_number = await context.page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);

		// Close Browser
		await context.browser.close();

	// Catch Errors
	} catch( err ) {
		console.log( err );
		await context.page.screenshot( { path: 'error-' + counter_start_ms + '.png', fullPage: true } );
		await context.browser.close();
	}

	// End Counter
	var counter_stop = new Date();
	var counter_stop_ms = ( counter_stop.getTime() + '.' + counter_stop.getMilliseconds() );
	context.vars.lapsed = Math.round( counter_stop_ms - counter_start_ms );

	// Process Latency
	events.emit( 'histogram', 'HeadlessChromiumLatency', context.vars.lapsed );

	// Return
	return next();
}
