const mysql = require('mysql2/promise');

const dbConf = require('../../config').dbConfig;

/**
 * イベント管理に必要なデータ
 */
module.exports = {
  /**
   * イベント一覧表示
   */
  findAll: async function () {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `SELECT * FROM events WHERE E_delete_flag = 0`;
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
  },

  /**
   * PKからイベントの詳細情報を選択
   */
  findByPK: async function (event_id) {
    let result;
    // sql
    const all = "E_id, E_name, DATE_FORMAT(E_datetime, '%Y年%m月%d日 %H時%i分') AS E_datetime, E_ticket_sum, E_description, E_public_flag";
    const sql = `SELECT ${all} FROM events WHERE E_id = ${event_id} AND E_delete_flag = 0`;
    // select実行
    const pool = mysql.createPool(dbConf);
    // pool.query = util.promisify(pool.query); // この行がポイントらしい
    try {
      const [rows, fields] = await pool.query(sql);
      // データの加工処理&データ返す処理
      if(rows[0] != undefined) {
        result = rows[0];
      }
      else{
        const sampleRow = {
          E_id : "1",
          E_name : "イベント名てすと",
          E_datetime : "2023年03月19日 03時00分",
          E_ticket_sum : "444",
          E_description : "テストテキストテストテキストテストテキストテストテキストテストテキストテストテキストテストテキスト",
          E_public_flag : "1"
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
   * イベントの詳細情報を新規登録(Transaction)
   */
  insert: async function (name, datetime, ticket_sum, description) {
    let result;

    const pool = mysql.createPool(dbConf);
    const connection = await pool.getConnection();

    try{
      let insert1Id;
      await connection.beginTransaction()
      const [rows, fields] = await connection.query("INSERT INTO events (E_name, E_datetime, E_ticket_sum, E_description, E_public_flag, E_delete_flag) VALUES(?, ?, ?, ?, 0, 0)", [name, datetime, ticket_sum,description])
      insert1Id = rows.insertId;
      await connection.query("INSERT INTO remains (R_event_id, R_remain_num) VALUES(?, ?)", [insert1Id, ticket_sum])
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
   * イベントの詳細情報を更新
   */
  update: async function (event_id, name, datetime, ticket_sum, description) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `UPDATE events SET E_name = '${name}', E_datetime = '${datetime}', E_ticket_sum = '${ticket_sum}', E_description = '${description}' WHERE E_id = ` + event_id;
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
   * イベントの公開設定
   */
  public: async function (event_id) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `UPDATE events SET E_public_flag = 1 WHERE E_id = ` + event_id;
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
   * イベントの論理削除
   */
  delete: async function (event_id) {
    let result;
    const pool = mysql.createPool(dbConf);
    const sql = `UPDATE events SET E_delete_flag = 1 WHERE E_id = ` + event_id;
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
  }
}
