
const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );

const test_url = 'https://dev-accelerated-store-demo.pantheonsite.io/shop/';

( async function runTest() {

	try {

		// Open Browser
		const browser = await puppeteer.launch( { headless: true } );
		const page = await browser.newPage();
		await page.setViewport( { width: 1280, height: 1280 } )

		// Hit URL
		console.log( '1 - Opening URL' );
		await page.goto( test_url, { 'waitUntil' : 'networkidle0', timeout: 0 } );
		await page.waitForSelector( "a[data-product_id='36']", { timeout: 0 } );

		// Click Add To Cart Button
		console.log( '2 - Clicking Add To Cart' );
		await page.click( "a[data-product_id='36']" );
		await page.waitForSelector( 'a.added_to_cart', { timeout: 0 } );

		// Click View Cart Button
		console.log( '3 - Clicking View Cart' );
		await page.click( 'a.added_to_cart' );
		await page.waitForSelector( 'input.qty', { timeout: 0 } );

		// Set Quantity (AJAX)
		console.log( '4 - Changing Quantity Field' );
		await page.evaluate( () => { document.querySelector( 'input.qty' ).value = '10' } );

		// Updating Cart Quantity
		console.log( '5 - Clicking Update Cart' );
		await page.click( "button[name='update_cart']" );
		await page.waitForSelector( 'a.checkout-button', { timeout: 0 } );

		// Click Checkout Button
		console.log( '6 - Clicking Checkout Button' );
		await page.click( 'a.checkout-button' );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Checkout Form (AJAX)
		console.log( '7 - Completing Checkout Form Fields' );
		await page.evaluate( () => { document.querySelector( 'input#billing_first_name' ).value = 'First Name' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_last_name' ).value = 'Last Name' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_address_1' ).value = '12345 Test St.' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_city' ).value = 'Los Angeles' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_postcode' ).value = '91307' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_phone' ).value = '111-222-3333' } );
		await page.evaluate( () => { document.querySelector( 'input#billing_email' ).value = 'tester@codedcommerce.com' } );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// State Drop Down (AJAX)
		console.log( '8 - Selecting State Drop Down' );
		await page.select( 'select#billing_state', 'CA' );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Complete Payment Method (AJAX)
		console.log( '9 - Selecting COD Payment' );
		await page.click( "label[for='payment_method_cod']" );
		await page.waitForSelector( 'button#place_order', { timeout: 0 } );

		// Submit Checkout
		await page.waitFor( 1000 );
		console.log( '10 - Clicking Place Order Button' );
		await page.click( 'button#place_order' );
		await page.waitForSelector( 'li.order', { timeout: 0 } );

		// Order Receipt
		console.log( '11 - Parsing Order Receipt' );
		const order_number = await page.evaluate(
			() => document.querySelector( 'li.order strong' ).textContent
		);
		console.log( '12 - Order placed: ' + order_number.trim() );

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
