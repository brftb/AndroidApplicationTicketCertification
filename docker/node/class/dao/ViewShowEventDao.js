const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * イベント管理に必要なデータ
 */
module.exports = {
  /**
   * PKからイベントの詳細情報を選択
   */
  findAll: async function (event_id) {
    let result;
    // sql
    const sql = `SELECT * FROM view_show_events`;
    // select実行
    const pool = mysql.createPool(dbConf);
    try {
      const [rows, fields] = await pool.query(sql);
      // データの加工処理&データ返す処理
      if(rows[0] != undefined) {
        result = rows;
      }
      else{
        const sampleRows = [{
          E_id : "999",
          E_name : "イベント名てすと",
          E_datetime : "2023年03月19日 03時00分",
          R_num : "444",
          E_description : "テストテキストテストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト"
        }]
        result = sampleRows;
      }
    } catch (err) {
      console.log(err);
    } finally {
      pool.end();
    }
    return result;
  },

  /**
   * PKからイベントの詳細情報を選択
   */
  findByPK: async function (event_id) {
    let result;
    // sql
    const sql = `SELECT * FROM view_show_events WHERE E_id = ${event_id}`;
    // select実行
    const pool = mysql.createPool(dbConf);
    try {
      const [rows, fields] = await pool.query(sql);
      // データの加工処理&データ返す処理
      if(rows[0] != undefined) {
        result = rows[0];
      }
      else{
        const sampleRow = {
          E_id : "999",
          E_name : "イベント名てすと",
          E_datetime : "2023年03月19日 03時00分",
          R_num : "444",
          E_description : "テストテキストテストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト"
        }
        result = sampleRow;
      }
    } catch (err) {
      console.log(err);
    } finally {
      pool.end();
    }
    return result;
  }
}
