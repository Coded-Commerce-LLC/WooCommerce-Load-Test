
// Test Site
const test_url = 'https://dev-accelerated-store-demo.pantheonsite.io';

// Include Puppeteer
const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );

// Test Function
( async function runTest() {

	try {

		// Open Browser
		const browser = await puppeteer.launch( { headless: true } );
		const page = await browser.newPage();
		await page.setViewport( { width: 1280, height: 1280 } )

		// Adding To Cart
		console.log( '1 - Adding To Cart' );
		await page.goto( test_url + '/checkout/?add-to-cart=36', { 'waitUntil' : 'networkidle0', timeout: 0 } );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Checkout Form (AJAX)
		console.log( '2 - Completing Checkout Form Fields' );
		await page.evaluate( () => { document.querySelector( 'input#billing_email' ).value = 'tester@codedcommerce.com' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_first_name' ).value = 'First Name' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_last_name' ).value = 'Last Name' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_address_1' ).value = '12345 Test St.' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_city' ).value = 'Los Angeles' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_postcode' ).value = '91307' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_phone' ).value = '111-222-3333' } );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// State Drop Down (AJAX)
		console.log( '3 - Selecting State Drop Down' );
		await page.select( 'select#billing_state', 'CA' );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Payment Method (AJAX)
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
		const order_number = await page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);
		console.log( '7 - Order placed: ' + order_number.trim() );

		// Screen Shot
		//await page.screenshot( { path: order_number.trim() + '.png', fullPage: true } );

		// Close Browser
		await browser.close();

	// Catch Errors
	} catch( err ) {
		console.log( err );
		await page.screenshot( { path: 'error.png', fullPage: true } );
		await browser.close();
	}

} )();
