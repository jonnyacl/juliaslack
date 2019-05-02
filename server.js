'use strict';

const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.send("Julia Slack");
});

app.get('/clients', function(req, res) {
    res.send("Julia Slack Clients");
});

server.listen(port, () => {
  console.log(`Fractal Julia started on port ${port}`);
});