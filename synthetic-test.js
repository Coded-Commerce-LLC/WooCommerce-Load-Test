const puppeteer = require( '/usr/local/lib/node_modules/puppeteer' );

( async () => {

	// Open Browser
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport( { width: 1280, height: 800 } )
	await page.goto( 'https://dev-sean-sandbox.pantheonsite.io/' );

	// Click Add To Cart Button
	await page.waitForSelector( "a[data-product_id='36']" );
	await page.screenshot( { path: 'screenshots/home.png' } );
	await page.click( "a[data-product_id='36']" );

	// Click View Cart Button
	await page.waitForSelector( 'a.added_to_cart' );
	await page.screenshot( { path: 'screenshots/added-to-cart.png' } );
	await page.click( 'a.added_to_cart' );

	// Click Checkout Button
	await page.waitForSelector( 'a.checkout-button' );
	await page.screenshot( { path: 'screenshots/cart.png' } );
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

	// Submit Checkout
	await page.waitForSelector( 'span.woocommerce-Price-amount' );
	await page.screenshot( { path: 'screenshots/checkout.png' } );
	await page.click( 'button#place_order' );

	// Order Receipt
	await page.waitForSelector( 'p.woocommerce-thankyou-order-received' );
	await page.screenshot( { path: 'screenshots/receipt.png' } );

	// End
	await browser.close();

} )();
