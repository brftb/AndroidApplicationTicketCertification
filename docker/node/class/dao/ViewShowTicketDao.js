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
        const sampleRows = [{
          E_id : "99",
          E_name : "test",
          E_datetime : "2023年03月19日 03時00分",
          E_description : "テストテキストテストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト",
          T_seat_id : "55",
          T_mynumber : "0123456789",
          T_used_flag : "0"
        }]
        result = sampleRows;
      }
    } catch (err) {
      console.log(err);
    } finally {
      pool.end();
    }
    return result;
  }
}
