var express = require('express');

const eventRouter = express.Router({ mergeParams: true });

const ViewShowEventDao = require('../../class/dao/ViewShowEventDao');

eventRouter
// イベント一覧
  .get('/list', async (req, res, next) => {
    let eventsList = await ViewShowEventDao.findAll();
    // return json
    if(eventsList == null) res.json({ status : "4" });
    else if(eventsList.length == 0) res.json({ status : "1" });
    else res.json({ status : "2", list : eventsList });
  })

// イベント詳細情報
  .get('/detail', async (req, res, next) => {
    const param = req.query;
    let eventInfo = await ViewShowEventDao.findByPK(param.event_id);
    // return json
    res.json({ eventInfo });
  })
  ;

module.exports = eventRouter;