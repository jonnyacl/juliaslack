// const config = require("./config").config

const express = require('express');

const app = express();
// const authApi = require("./api/auth").auth
// const bankApi = require("./api/banking").banking
// const aApi = authApi.createAuthApi("REPLACE", "faekpartner");
// const bApi = bankApi.createBankApi("REPLACE", "faekpartner");

app.get('/clients', (req, res) => {
    res.send("Heroku running");
});

app.listen(8000, () => {
    // console.log(config)
    console.log("Fractal SB server running...");
});