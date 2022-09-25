const express = require('express');
var request = require('request');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "http://192.168.50.120";

const simpleRequestLogger = (proxyServer, options) => {
        proxyServer.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[HPM] [${req.method}] ${req.url}`); // outputs: [HPM] GET /users
        });
    }

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to Bleach Server Arduino Device');
});

app.use('/', express.static('public'))

app.use('/on', (req, res, next) => {

    console.log("ON:",req.method,req.url );

    const url = API_SERVICE_URL+req.baseUrl+'?time=500';

    request(url, function (error, response, body) {

        console.log("Pump process completed...");

        if (!error && response.statusCode == 200) {
            console.log(body) // Print the body of response.
            res.status(200);
            res.send();

        } else {
            res.status(500);
            res.end()
        }
    })

});


// Start Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
