'use strict';

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

app.post('/julia', function(req, res) {
    res.send("Hi I'm Julia. I'll help you manage your multiple spouses");
});

let cId = undefined;
let acctId = undefined;

app.post('/clients', function(req, res) {
    authApi.getToken().then(resp => {
        bankApi.getAccounts(resp.data.access_token, 7).then(bankResp => {
            const respData = bankResp.data;
            const companies = []
            for (let c in respData.results) {
                console.log(respData.results[c])
                companies.push({ company: respData.results[c].companyId, account: respData.results[c].AccountId })
                cId = respData.results[c].companyId;
                acctId = respData.results[c].AccountId;
            }
            res.send(`These SMEs need your love: ${JSON.stringify(companies)}`);
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

app.post('/clients/bals', function(req, res) {
    const compId = cId ? cId : 65;
    const accId = acctId ? acctId : "ohhithere";
    authApi.getToken().then(resp => {
        bankApi.getAccountBalances(resp.data.access_token, 7, accId, compId).then(bankResp => {
            const respData = bankResp.data;
            const bals = []
            for (let c in respData.results) {
                console.log(respData.results[c])
                bals.push({ company: respData.results[c].companyId, account: respData.results[c].accountId, balance: respData.results[c].amount, currency: respData.results[c].currencyCode, date: respData.results[c].date })
            }
            res.send(`Your struggling SMEs' recent account balances: ${JSON.stringify(bals)}`);
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

app.post('/clients/cashflow', function(req, res) {
    const compId = cId ? cId : 65;
    const accId = acctId ? acctId : "ohhithere";
    authApi.getToken().then(resp => {
        bankApi.getAccountTransactions(resp.data.access_token, 7, accId, compId).then(bankResp => {
            const respData = bankResp.data;
            const bals = []
            for (let c in respData.results) {
                console.log(respData.results[c])
                bals.push({ company: respData.results[c].companyId, account: respData.results[c].accountId, transaction: respData.results[c].amount, currency: respData.results[c].currencyCode, date: respData.results[c].bookingDate, info: respData.results[c].description, type: respData.results[c].type, merchant: respData.results[c].merchant.name })
            }
            res.send(`Your struggling SMEs' recent cashflow: ${JSON.stringify(bals)}`);
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