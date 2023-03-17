const express = require('express');
const ls = require('local-storage')

const qrRouter = express.Router({ mergeParams: true });

const TicketDao = require('../class/dao/TicketDao');

qrRouter
// 一時的コードを生成 → 期限付きQRコードを表示
  .get('/display', async (req, res, next) => {
    const param = req.query;
    const event_id = param.eventId;
    const seat_id = param.seatId;
    const mynumber = param.mynumber;

    //現在日時と期限日時
    const date = new Date();
    const currentTime = formattedDateTime(date);
    ls.set(mynumber+"period", date.getTime()+25000); // タイムスタンプ

    // 一時的コード生成
    let S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let N=16
    let rand_str = '';
    for ( var i = 0; i < N; i++ ) {
      rand_str += S.charAt(Math.floor(Math.random() * S.length));
    }
    let code = seat_id + mynumber + currentTime + rand_str + event_id;

    // 生成したコードを保存
    ls.set(mynumber,rand_str)

    // return json
    res.json({
      code : code
    });
  })

// スキャンしたコードを認証
  .post('/scan', async (req, res, next) => {
    let resultStatus = '';

    const eventId = req.body.eventId;
    const readCode = req.body.code;
    const seatIdLength = readCode.split('[',1)[0].length;
    const mynumberLength = readCode.split(']',1)[0].length + 1 - seatIdLength;
    const readSeatId = readCode.slice(0,seatIdLength);
    const readMynumber = readCode.slice(seatIdLength,seatIdLength+mynumberLength);
    const readDatetime = readCode.slice(seatIdLength+mynumberLength,seatIdLength+mynumberLength+14);
    const readRand_str = readCode.slice(seatIdLength+mynumberLength+14,seatIdLength+mynumberLength+14+16);
    const readEventId = readCode.slice(seatIdLength+mynumberLength+14+16);

    // 現在日時と期限日時
    const currentTime = new Date();
    const createTime = ls(readMynumber+"period");

    // 期限切れのQRコードでないことを確認
    if(createTime < currentTime){
      resultStatus = 'expired'
    }else{
      // 使用済みでないことを確認(期限切れを先にチェックしないとT_used_flagが存在しない)
      let tf = await TicketDao.checkUsed(readEventId,readSeatId,readMynumber);
      if(tf){
        // 保存してあるコードと比較
        if(readRand_str == ls(readMynumber) && readEventId == eventId){
          // DB
          let tf = await TicketDao.useTicket(readEventId,readSeatId,readMynumber);
          if(tf){
            resultStatus = 'ok';
            // 保存してあるコードを削除
            ls.remove(readMynumber)
          }else{
            resultStatus = 'err';
          }
        }
      }else{
        resultStatus = 'ng';
      }
    }

    // return json
    res.json({
      status : resultStatus
    });
  })
;

// 日時フォーマット「YYYYMMDDHHmmss」関数
function formattedDateTime(date) {
  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  const h = ('0' + date.getHours()).slice(-2);
  const mi = ('0' + date.getMinutes()).slice(-2);
  const s = ('0' + date.getSeconds()).slice(-2);
  return y + m + d + h + mi + s;
}

module.exports = qrRouter;