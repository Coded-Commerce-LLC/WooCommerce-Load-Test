# WooCommerce ReST API Load Test Script

Sends traffic to a WooCommerce site, usually a development environment.
Places unpaid orders using a ReST API authorized account.

Uses the [Artillery.io project](https://artillery.io) based on Node.JS

Also includes a synthetic test script powered by [Puppeteer project](https://github.com/GoogleChrome/puppeteer)

## Prerequisites

First, install Node.JS onto your workstation, if not already installed.

[Download it from this link](https://nodejs.org/en/download/)

Or, to update an existing installation:
```
sudo npm install -g npm@latest --unsafe-perm=true --allow-root
```

Next, install or update the artillery.io project:
```
sudo npm install -g artillery@1.6.0-25 --unsafe-perm=true --allow-root
```

## Running the load test

* Download this project to your workstation and change directory to it.
* Create a read/write access ReST API account from WP Admin > WooCommerce > Settings > Advanced > REST API.
* Put your ReST account key and secret values into a [base64 Hash generator](https://www.base64encode.org) formatted as `key:secret` to get your authentication hash.
* Make a CSV file `loadtest_payload.csv` with several lines containing input data: `Name,ProductID,Quantity,AuthHash`
* Edit the YML file and ensure the `duration`, `arrivalRate`, and `rampTo` values are low for your initial test.
* Edit the YML file and change the `target` value to the development site you wish to load test.
* Disable emails on your sandbox site under WooCommerce > Settings > Emails.
* Run `artillery run loadtest_rest_api.yml -o results.json` to execute your test and see the results in standard output.
* Enter `artillery report results.json` to view a graphical report of results.
* If you run into any errors, try debugging with the `loadtest_monitor.js` file response body function.

### Further Notes

* I recommend having an application performance monitoring tool running on your development environment so you can examine the bottlenecks that load testing exposes. The most popular tool is New Relic.
* The CSV file records are used randomly for load test source data. You can put as few or as many records in there you wish.
* Refer to the Artillery.io documentation for details on [configuration](https://artillery.io/docs/script-reference/).

### Synthetic Test

* First, install or update Puppeteer by running  `sudo npm install -g puppeteer@latest --unsafe-perm=true --allow-root`
* Run Puppeteer (Chromium headless browser) with our test script `node synthetic-standalone.js`

### Synthetic Load Test

* Run `artillery run loadtest_synthetic.yml -o results.json`.
* Enter `artillery report results.json` to view a graphical report of results.

## Author

* **Coded Commerce, LLC** - *Initial work* - [Coded-Commerce-LLC](https://github.com/Coded-Commerce-LLC)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
