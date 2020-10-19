const jwt = require('jsonwebtoken')
module.exports = {
    authentication: (req,res,next) => {
        const {token} = req.headers
        if(!token) {
            res.send({
                message: 'token harus di isi'
            })
        } else {
            next()
        }
    },
    authorization: (req,res, next) => {
        const {token} = req.headers
        
        jwt.verify(token, process.env.PrivateKEy, function (err, decoded) {
            if(err){
               res.status(405).send({
                 message: "gagal authenticate",
                 code: 405
               })
            } else {
                next()
            }
        });

    }
}