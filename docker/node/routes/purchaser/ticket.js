var express = require('express');

const ticketRouter = express.Router({ mergeParams: true });

const TicketDao = require('../../class/dao/TicketDao');

ticketRouter
// チケット購入
  .post('/purchase', async (req, res, next) => {
    const param = req.body;
    let tf = await TicketDao.purchase(param.event_id, param.mynumber);
    // return json
    if(tf) res.json({ status : "1" });
    else res.json({ status : "0" });
  })
  ;

module.exports = ticketRouter;