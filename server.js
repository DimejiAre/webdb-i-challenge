const express = require('express');

const server = express();

const accounts = require('./accountRouter');

server.use(express.json());

server.use('/api/accounts', accounts)

server.get('/', (req,res) => {
    res.json('Welcome to My Api');
})

module.exports = server;