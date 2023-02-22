const express = require('express');

const sellerRouter = express.Router();
const eventRouter = require('./seller/event');

sellerRouter
// イベント管理
  .use('/event', eventRouter)
;

module.exports = sellerRouter;