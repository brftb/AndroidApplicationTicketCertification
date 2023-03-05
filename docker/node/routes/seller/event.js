var express = require('express');

const eventRouter = express.Router({ mergeParams: true });

const EventDao = require('../../class/dao/EventDao');

eventRouter
// イベント一覧
  .get('/list', async (req, res, next) => {
    let eventsList = await EventDao.findAll();
    // return json
    if(eventsList == null) res.json({ status : "4", });
    else if(eventsList.length == 0) res.json({ status : "1" });
    else res.json({ status : "2", list: eventsList });
  })

// イベント詳細情報
  .post('/register', async (req, res, next) => {
    const param = req.body;
    let tf = await EventDao.insert(param.name, param.datetime, param.sum, param.description);
    if(tf) res.json({ status : "1" });
    else res.json({ status : "0" });
  })

// イベント詳細情報
  .get('/detail', async (req, res, next) => {
    const param = req.query;
    let eventDetail = await EventDao.findByPK(param.event_id);
    // return json
    res.json({
      eventDetail
    });
  })

// イベント情報更新
  .post('/update', async (req, res, next) => {
    const param = req.body;
    let tf = await EventDao.update(param.id, param.name, param.datetime, param.sum, param.description);
    // return json
    if(tf) res.json({ status : "1" });
    else res.json({ status : "0" });
  })

  // イベント情報更新
  .post('/public', async (req, res, next) => {
    const param = req.body;
    let tf = await EventDao.public(param.id);
    if(tf){
      // return json
      res.json({ status : "1" });
    }else{
      res.json({ status : "0" });
    }
  })

  // イベント情報更新
  .post('/delete', async (req, res, next) => {
    const param = req.body;
    let tf = await EventDao.delete(param.id);
    if(tf){
      // return json
      res.json({ status : "1" });
    }else{
      res.json({ status : "0" });
    }
  })
;

module.exports = eventRouter;