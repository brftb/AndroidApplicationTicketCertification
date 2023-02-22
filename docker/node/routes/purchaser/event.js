var express = require('express');

const eventRouter = express.Router({ mergeParams: true });

const ViewShowEventDao = require('../../class/dao/ViewShowEventDao');

eventRouter
// イベント一覧
  .get('/list', async (req, res, next) => {
    let eventsList = await ViewShowEventDao.findAll();
    // return json
    res.json({ list : eventsList });
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