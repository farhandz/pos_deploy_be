const db = require('../connection/db')

module.exports = {
  getHIstory: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM history`, (err, result) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(result);
        }
      });
    });
  },
  getHIstoryid: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM history WHERE ID = ${id}`, (err, result) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(result);
        }
      });
    });
  },

  InsertHistory: (invoices, orders, amount) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO history (invoices, orders, amount) VALUES('${invoices}', '${orders}', '${amount}')`,
        (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  deleteId: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM history WHERE id = ${id}`, (err, result) => {
        if (err) {
          reject(new Error(err));
        } else {
          resolve(result);
        }
      });
    });
  },

  updateId: (invoices, orders, amount, id) => {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE history SET invoices = '${invoices}', orders='${orders}', amount = ${amount} WHERE id= '${id}'`, (err, result) => {
          if(err) {
              reject(err)
          } else{
              resolve(result)
          }
      } );
    });
  },
};