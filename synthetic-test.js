const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );

( async () => {

	// Open Browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport( { width: 1280, height: 1280 } )
	await page.goto( 'https://dev-sean-sandbox.pantheonsite.io/' );

	// Click Add To Cart Button
	await page.waitForSelector( "a[data-product_id='36']" );
	//await page.screenshot( { path: 'step1-home.png', fullPage: true } );
	await page.click( "a[data-product_id='36']" );

	// Click View Cart Button
	await page.waitForSelector( 'a.added_to_cart' );
	//await page.screenshot( { path: 'step2-added-to-cart.png', fullPage: true } );
	await page.click( 'a.added_to_cart' );

	// Click Checkout Button
	await page.waitForSelector( 'a.checkout-button' );
	//await page.screenshot( { path: 'step3-cart.png', fullPage: true } );
	await page.click( 'a.checkout-button' );

	// Checkout Page Loaded
	await page.waitForSelector( 'button#place_order' );

	// Complete Checkout Form
	await page.click( "label[for='payment_method_cod']" );
	await page.click( "label[for='billing_state']" );
	await page.type( "label[for='billing_state']", 'California' + String.fromCharCode( 13 ) );
	await page.type( 'input#billing_first_name', 'First Name' );
	await page.type( 'input#billing_last_name', 'Last Name' );
	await page.type( 'input#billing_address_1', '12345 Test St.' );
	await page.type( 'input#billing_city', 'Los Angeles' );
	await page.type( 'input#billing_postcode', '91307' );
	await page.type( 'input#billing_phone', '111-222-3333' );
	await page.type( 'input#billing_email', 'sean@codedcommerce.com' );

	// Wait For AJAX Refresh
	await page.evaluate(() => {
		let dom = document.querySelector( 'tr.order-total span.amount' );
		dom.innerHTML = "LOAD";
	} );
	await page.screenshot( { path: 'step4-checkout.png', fullPage: true } );
	await page.waitForSelector( 'tr.order-total span.amount' );
	await page.screenshot( { path: 'step5-refreshed.png', fullPage: true } );

	// Submit Checkout
	await page.click( 'button#place_order' );

	// Order Receipt
	await page.waitForSelector( 'li.order' );
	const order_number = await page.evaluate(
		() => document.querySelector( 'li.order strong' ).textContent
	);
	console.log( 'Order placed: ' + order_number.trim() );
	await page.screenshot( {
		path: 'step6-order-' + order_number.trim() + '-placed.png',
		fullPage: true
	} );

	// End
	await browser.close();

} )();
