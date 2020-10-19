const db = require ('../connection/db')
module.exports = {
  getProduct: (page, limit) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT produk.id, image, harga, title, nama_kategori from produk INNER JOIN category on produk.id_category = category.id LIMIT ${limit} OFFSET ${page} `, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
  displayAll: (sort, by, search)=> {
    return new Promise((resolve, reject)=> {
      db.query(`SELECT produk.id, image, harga, title, nama_kategori from produk INNER JOIN category on produk.id_category = category.id  WHERE title LIKE '%${search}%'   ORDER BY ${sort}  ${by} `, (err, result)=> {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  getAll: ()=> {
    return new Promise((resolve, reject)=> {
      db.query(`SELECT produk.id, image, harga, title, nama_kategori from produk INNER JOIN category on produk.id_category = category.id`, (err, result)=> {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },
  addPRoduct: (title, harga, image, id_category) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO produk (id_category, title, harga, image) VALUES(   ${id_category}, '${title}', '${harga}', '${image}')`,
        (err, result) => {
          console.log(result)
          console.log(err)
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  deleteProduk: (id) => {
    return new Promise((resolve,reject) => {
      db.query(`DELETE FROM produk WHERE id = ${id}`, (err, result) => {
        if(err) {
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  },
  finOne: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM produk WHERE id = ${id}`, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  },

  updateProduk: (title,  harga, image, id, idcategory) => {
    return new Promise ((resolve,reject) => {
      db.query(`UPDATE produk SET title='${title}', id_category= '${idcategory}', harga='${harga}', image= '${image}' WHERE id= '${id}'`, (err, result) => {
        if(err){
          reject(new Error(err))
        } else {
          resolve(result)
        }
      })
    })
  }
};