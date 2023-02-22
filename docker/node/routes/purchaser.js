const express = require('express');

const purchaserRouter = express.Router();
const userRouter = require('./purchaser/user');
const eventRouter = require('./purchaser/event');
const ticketRouter = require('./purchaser/ticket');

purchaserRouter
// 会員情報
  .use('/user', userRouter)
// イベント情報
  .use('/event', eventRouter)
// チケット情報
  .use('/ticket', ticketRouter)
  ;

module.exports = purchaserRouter;