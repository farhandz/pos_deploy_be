const jwt = require('jsonwebtoken')
module.exports = {
    // admin
    accesUSer: (req,res, next) => {
        const {token} = req.headers
        jwt.verify(token, process.env.PrivateKEy, (err,data)=> {
          if(data.level === 1){
              res.send({message: 'admin gk boleh masuk / hanya akun admin'})
          } else {
              next()
          }
        });
    },
    // kasir
    accesAdmin: (req,res,next) =>{
        const {token} = req.headers
        jwt.verify(token, process.env.PrivateKEy, (err,data)=> {
           if(data.level === 0) {
               res.send({message: 'kasir gk boleh masuk / hanya akun admin'})
           } else {
               next()
           }
        });
    }
}
