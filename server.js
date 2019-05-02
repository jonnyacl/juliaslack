'use strict';

const path = require('path');
const express = require('express');
const http = require('http');

const fractal = require('fractalsdk')
const appKey = "OBNl3HRb6hab3cQuIDmJq8T9FYyHEX4L9I4ummml";
const partner = "juliaslack";

const authApi = fractal.api.createAuthApi(appKey, partner);
const bankApi = fractal.api.createBankApi(appKey, partner);

const app = express();
const server = http.Server(app);

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.send("Julia Slack");
});

app.post('/clients', function(req, res) {
    authApi.getToken().then(resp => {
        bankApi.getAccounts(resp.data.access_token, 7).then(bankResp => {
            const respData = bankResp.data;
            const companies = []
            for (let c in respData.results) {
                console.log(respData.results[c])
                companies.push({ companyId: respData.results[c].companyId, accountId: respData.results[c].AccountId })
            }
            res.send(JSON.stringify({ companies }));
        }).catch(err => {
            console.log(err)
            res.status(err.response.status)
            res.send(err.response.data)
        })
    }).catch(err => {
        console.log(err.response.data)
        res.status(err.response.status)
        res.send(err.response.data)
    })
});

app.post('/clients/:accId/:cId/bals', function(req, res) {
    const compId = req.params.cId
    const accId = req.params.accId
    authApi.getToken().then(resp => {
        bankApi.getAccountBalances(resp.data.access_token, 7, accId, compId).then(bankResp => {
            console.log(bankResp.data)
            res.send(JSON.stringify(bankResp.data));
        }).catch(err => {
            console.log(err.response.data)
            res.status(err.response.status)
            res.send(err.response.data)
        })
    }).catch(err => {
        console.log(err.response.data)
        res.status(err.response.status)
        res.send(err.response.data)
    })
});

app.post('/clients/:accId/:cId/cashflow', function(req, res) {
    const compId = req.params.cId
    const accId = req.params.accId
    authApi.getToken().then(resp => {
        bankApi.getAccountTransactions(resp.data.access_token, 7, accId, compId).then(bankResp => {
            console.log(bankResp.data)
            res.send(JSON.stringify(bankResp.data));
        }).catch(err => {
            console.log(err.response.data)
            res.status(err.response.status)
            res.send(err.response.data)
        })
    }).catch(err => {
        console.log(err.response.data)
        res.status(err.response.status)
        res.send(err.response.data)
    })
});

server.listen(port, () => {
  console.log(`Fractal Julia started on port ${port}`);
});