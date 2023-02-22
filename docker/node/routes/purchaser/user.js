var express = require('express');

const userRouter = express.Router({ mergeParams: true });

const UserDao = require('../../class/dao/UserDao');
const ViewShowTicketDao = require('../../class/dao/ViewShowTicketDao');

userRouter
// 会員情報新規登録
  .post('/register', async (req, res, next) => {
    const param = req.body;
    let tf = await UserDao.insert(param.mynumber, param.name, param.password, param.mail);
    // return json
    if(tf) res.json({ status : "1" });
    else res.json({ status : "0" });
  })

// 購入済チケット表示
  .get('/mypage', async (req, res, next) => {
    const param = req.query;
    let eventsList = await ViewShowTicketDao.findByMynumber(param.mynumber);
    // return json
    res.json({
      list: eventsList
    });
  })

// アカウント登録済かのチェック
  .post('/main_check', async (req, res, next) => {
    const param = req.body;
    let result = await UserDao.checkRowByPK(param.mynumber);
    // return json
    if(result == "0") res.json({ status : "yes" });
    else if(result == "1") res.json({ status : "no" });
    else if(result == "err") res.json({ status : "err" });
  })
  ;

module.exports = userRouter;