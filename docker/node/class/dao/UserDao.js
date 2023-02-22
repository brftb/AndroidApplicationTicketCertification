const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * 会員管理に必要なデータ
 */
module.exports = {
  /**
   * PKから会員の詳細情報を選択
   */
  findByPK: async function (mynumber) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `SELECT * FROM users WHERE US_mynumber = ` + mynumber;
    // select実行
    try{
      const [rows, fields] = await pool.query(sql);
      // データの加工処理&データ返す処理
      if(rows[0] != undefined) {
        result = rows[0];
      }
      else{
        const sampleRow = {
          US_mynumber : "0123456789",
          US_name : "ユーザー名てすと",
          US_password : "pa$$w0rd",
          US_mail : "test@mail.com",
          US_state : "0"
        }
        result = sampleRow;
      }
    } catch (err) {
      console.log(err);
    } finally {
      pool.end();
    }
    return result;
  },

  /**
   * 会員の詳細情報を新規登録
   */
  insert: async function (mynumber, name, password, mail) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `INSERT INTO users (US_mynumber, US_name, US_password, US_mail, US_state) VALUES('${mynumber}', '${name}', '${password}', '${mail}', 0)`;
    // insert実行
    try {
      await pool.query(sql);
      result = true;
    } catch (err) {
      console.log(err);
      result = false;
    } finally {
      pool.end();
    }
    return result;
  },


  /**
   * 会員の詳細情報を新規登録
   */
  checkRowByPK: async function (mynumber, name, password, mail) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `SELECT count(*) AS count FROM users WHERE US_mynumber = "${mynumber}"`;
    // insert実行
    try {
      const [rows, fields] = await pool.query(sql);
      if(rows[0].count == 0) result = "0";
      else result = "1";
    } catch (err) {
      console.log(err);
      result = "err";
    } finally {
      pool.end();
    }
    return result;
  }
}
