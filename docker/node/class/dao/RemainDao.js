const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * チケット残り枚数管理に必要なデータ
 */
module.exports = {
  /**
   * PKからチケット残り枚数の詳細情報を選択
   */
  findByPK: async function (event_id) {
    // sql
    const sql = `SELECT * FROM remains WHERE R_event_id = ` + event_id;
    // select実行
    const pool = mysql.createPool(dbConf);
    const [rows, fields] = await pool.execute(sql);
    await pool.end();
    // データの加工処理&データ返す処理
    return rows[0];
  },

  /**
   * チケット残り枚数の詳細情報を更新
   */
  update: async function (event_id, remain_num) {
    // sql
    const sql = `UPDATE remains SET R_remain_num = '${remain_num}' WHERE R_event_id = ` + event_id;
    // select実行
    const pool = mysql.createPool(dbConf);
    await pool.query(sql);
    await pool.end();
  }
}
