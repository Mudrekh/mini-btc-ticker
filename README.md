# mini-btc-ticker

This is a small mini btc ticker using electron connected to the GDAX api. I just
wanted something to easily show the BTC price with not many frills.

To run use npm start

Known Problems:
GDAX limits the rate at which you can connect to the web socket. So sometimes,
you may not establish a connection if you start and restart the applicationt too
quickly.