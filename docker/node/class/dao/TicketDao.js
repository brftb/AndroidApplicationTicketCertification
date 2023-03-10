const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * チケット管理に必要なデータ
 */
module.exports = {
  /**
   * チケット購入トランザクション
   */
  purchase: async function (event_id, mynumber) {
    let result;
    const pool = mysql.createPool(dbConf);
    const connection = await pool.getConnection();
    // transaction実行
    try{
      await connection.beginTransaction()
      const [rows, fields] = await connection.query("SELECT * FROM remains WHERE R_event_id = ?", [event_id])
      let update_remain_num = rows[0].R_remain_num - 1;
      await connection.query("UPDATE remains SET R_remain_num = ? WHERE R_event_id = ?", [update_remain_num, event_id])
      await connection.query("INSERT INTO tickets (T_event_id, T_seat_id, T_mynumber, T_used_flag) VALUES(?,?,?,0)", [event_id, update_remain_num, mynumber])
      await connection.commit()
      result = true;
    } catch (err) {
      await connection.rollback();
      console.log(err);
      result = false;
    } finally {
      connection.release()
      pool.end();
    }
    return result;
  },

  /**
   * チケット使用
   */
  useTicket: async function (event_id, seat_id , mynumber) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `UPDATE tickets SET T_used_flag = 1 WHERE T_event_id = ${event_id} AND T_seat_id = '${seat_id}' AND T_mynumber = '${mynumber}'`;
    // select実行
    try{
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
   * 使用済みチェック
   */
  checkUsed: async function (event_id, seat_id , mynumber) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `SELECT T_used_flag FROM tickets WHERE T_event_id = ${event_id} AND T_seat_id = '${seat_id}' AND T_mynumber = '${mynumber}'`;
    try{
      const [rows, fields] = await pool.query(sql);
      if(rows[0].T_used_flag == '0') result = true;
      else result = false;
    } catch (err) {
      console.log(err);
      result = false;
    } finally {
      pool.end();
    }
    return result;
  }
}
