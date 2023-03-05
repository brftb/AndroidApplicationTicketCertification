const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * チケット管理に必要なデータ
 */
module.exports = {
  /**
   * マイナンバーからチケットリストを選択
   */
  findByMynumber: async function (mynumber) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `SELECT * FROM view_show_tickets WHERE T_mynumber = '` + mynumber + `'`;
    // select実行
    try{
      const [rows, fields] = await pool.query(sql);
      // データの加工処理&データ返す処理
      if(rows[0] != undefined) {
        result = rows;
      }
      else{
        result = []; // 空配列
      }
    } catch (err) {
      console.log(err);
      result = null;
    } finally {
      pool.end();
    }
    return result;
  }
}
