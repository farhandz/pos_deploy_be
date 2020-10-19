const db = require('../connection/db')

module.exports = {
  insertMaster: (invoices, orders, amount) => {
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
  insertDetail: (id_transaksi, id_product, id_category, qty, price) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO history_detail (id_transaksi, id_product, id_category, qty, price) VALUES('${id_transaksi}' ,'${id_product}', '${id_category}', ${qty},  ${price} )`,
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
};