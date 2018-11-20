# WooCommerce ReST API Load Test Script

Sends traffic to a WooCommerce site, usually a development environment.
Places unpaid orders using a ReST API authorized account.

Uses the [Artillery.io project](https://artillery.io) based on Node.JS

## Prerequisites

First, install Node.JS onto your workstation, if not already installed.

[Download it from this link](https://nodejs.org/en/download/)

Next, install the artillery.io project:
```
sudo npm install -g artillery --unsafe-perm=true --allow-root
artillery -V
artillery quick --count 10 -n 20 https://artillery.io/
```

Or, to update an existing artillery.io installation:
```
sudo npm install -g artillery@latest --unsafe-perm=true --allow-root
```

## Running the tests

* Download this project to your workstation and change directory to it.
* Create a read/write access ReST API account from WP Admin > WooCommerce > Settings > Advanced > REST API.
* Put your ReST account key and secret values into a [base64 Hash generator](https://www.base64encode.org) formatted as `key:secret` to get your authentication hash.
* Make a CSV file `loadtest_payload.csv` with several lines containing input data: `Name,ProductID,Quantity,AuthHash`
* Edit the YML file and ensure the `duration`, `arrivalRate`, and `rampTo` values are low for your initial test.
* Edit the YML file and change the `target` value to the development site you wish to load test.
* Disable emails on your sandbox site under WooCommerce > Settings > Emails.
* Run `artillery run loadtest_orders.yml` to execute your test and see the results in standard output.
* If you run into any errors, try debugging with the `loadtest_monitor.js` file response body function.

### Further Notes

I recommend having an application performance monitoring tool running on your development environment so you can examine the bottlenecks that load testing exposes. The most popular tool is New Relic.

The CSV file records are used randomly for load test source data. You can put as few or as many records in there you wish.

Refer to the Artillery.io documentation for details on [configuration](https://artillery.io/docs/script-reference/).

If you wish to place paid orders or do a more elaborate load test, for example using a credit card sandbox account, you will need to use more synthetic tools such as CasperJS to emulate a web browser.

## Author

* **Coded Commerce, LLC** - *Initial work* - [Coded-Commerce-LLC](https://github.com/Coded-Commerce-LLC)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
