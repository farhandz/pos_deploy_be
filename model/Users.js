const db = require('../connection/db')
const { resume, promise } = require('../connection/db');
const { reject } = require('lodash');
module.exports = {
    userRegister: (email, password, verification) => {
       return new Promise((resolve, reeject)=> {
           db.query(
             `INSERT INTO user (emails, password, verification) VALUES ('${email}', '${password}', '${verification}')`,
             (err, result) => {
               if (err) {
                 reeject(err);
               } else {
                 resolve(result);
               }
             }
           );
       })
    },
    findByEmail: (email) => {
        return new Promise((resolve, reeject) => {
            db.query(`SELECT * FROM user WHERE emails = '${email}' `, (err, result) => {
                if(err) {
                    reeject(err)
                } else {
                    resolve(result)
                }
            })
        })
    },
    deleteUser: (id) => {
     return new Promise((resolve, reject) => {
        db.query(`DELETE FROM user WHERE id = ${id}`, (err, result)=>{
          if(err){
            reject(err)
          } else {
            resolve(result)
          }
        })
     })
    },
    updateProduk: (user, password)=> {
      return new Promise((resolve, reject) => {
        db.query(`UPADATE produk set password = '${password}' email = '${email}'`, (err, result)=> {
          if(err){
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    },
    refreshToken: (refresh, email) => {
      return new Promise((resolve, reject) => {
        db.query(`UPDATE user set  RefreshToken = '${refresh}'  WHERE emails = '${email}'  `, (err, resullt)=> {
          if(err){
            reject(err)
          } else {
            resolve(resullt)
          }
        })
      })
    },
    logoutUser: (refresh) => {
      return new Promise((resolve, reject)=> {
        db.query(`UPDATE user set REfreshToken = null where RefreshToken = '${refresh}' ` , (err, resullt)=> {
          if(err) {
            reject(err)
          } else {
            resolve(resullt)
          }
        });
      })
    }
}