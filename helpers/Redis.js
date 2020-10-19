const redis = require('redis');
const redisClient = redis.createClient()
const _ = require('lodash');
const { displayAll } = require('../model/Produk');


module.exports = {
    getProduk: (req, res,next) => {
        redisClient.get('produk', function (err, data) { 
         if(data){
             let dataRedis = JSON.parse(data)
             const search = !req.query.search ? '' : req.query.search;
             const sort = !req.query.sort ? 'id' : req.query.sort
             const by =  !req.query.by ? 'asc' : req.query.by
             const limit = !req.query.limit ? parseInt(3) : parseInt(req.query.limit)
             const page = !req.query.page ? 0 : parseInt(req.query.page)
            //  const pagination = _.slice(dataRedis, (page-1) * limit, page * limit)
             const sortir =_.orderBy(dataRedis,[sort], [by])
            const asus = _.filter(sortir, (p) => {
              return _.includes(p.title, search);
            }).slice((page - 1) * limit, page * limit);
            
            const asu = _.filter(sortir, (p) => {
              return _.includes(p.title, search);
            })

            if(!page){
                 res.send({
                   message: "get book from redis",
                   totaPage: Math.ceil(dataRedis.length / limit),
                   data: asu,
                 });
            } else {
                 res.send({
                   message: "get book from redis",
                   totaPage: Math.ceil(dataRedis.length / limit),
                   page,
                   data: asus,
                 });
            }

         } else {
             next()
         }
        });
    },
    getCategory: (req,res,next)=> {
        redisClient.get('category', (err, data)=> {
            if(data){
                res.send({
                    message: "data from redis",
                    data: JSON.parse(data)
                })
            } else {
                next()
            }
        })
    }
}

