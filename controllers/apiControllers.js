const HistoryModel = require('../model/History')
const ProdukModel = require('../model/Produk')
const CategoryModel = require('../model/Category')
const UserModel = require('../model/Users')
const TransaksiModel = require('../model/Transaksi')
const verification = require('../helpers/SendVerification')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const salt = 10
const jwt = require('jsonwebtoken')
const fs = require('fs-extra')
const path = require('path')
let refresh_token = []
const redis = require('redis')
const Redis = require('../helpers/Redis')
const multer = require("../helpers/multer");
const Users = require('../model/Users')
const redisClient = redis.createClient();

module.exports = {
  getAllhistory: async (req, res) => {
    try {
      const data = await HistoryModel.getHIstory();
      res.json(data);
    } catch (error) {
      res.send(error.message);
    }
  },
  addHistory: async (req, res) => {
    try {
      const date = new Date();
      const { invoices, orders, amount } = req.body;
      const data = await HistoryModel.InsertHistory(
        invoices,
        orders,
        amount,
        date
      );
      res.json(data);
    } catch (error) {
      res.send(error.message);
    }
  },

  deleteHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const Del = await HistoryModel.deleteId(id);
      res.json(Del);
    } catch (error) {
      res.send(error.message);
    }
  },

  updateHistory: async (req, res) => {
    try {
      const { id } = req.params;
      const { invoices, orders, amount } = req.body;
      const Update = await HistoryModel.updateId(invoices, orders, amount, id);
      res.json(Update);
    } catch (error) {
      res.send(error.message);
    }
  },

  getProduct: async (req, res) => {
    try {
      const sort = !req.query.sort ? null : req.query.sort;
      const by = !req.query.by ? "" : req.query.by;
      const search = !req.query.search ? "" : req.query.search;
      const dataAll = await ProdukModel.displayAll(sort, by, search);
      redisClient.set("produk", JSON.stringify(dataAll));
      const limit = !req.query.limit ? 2 : parseInt(req.query.limit);
      const page = !req.query.page ? "" : parseInt(req.query.page);
      const totalpage = Math.ceil(dataAll.length / limit);
      if (!page) {
         res.send({
           message: "get book from database",
           data: dataAll,
         });
      } else {
        const offset = page === 1 ? 0 : (page - 1) * limit;
        const Produk = await ProdukModel.getProduct(offset, limit);
        res.json({
          totalRow: dataAll.length,
          message: "suscess pagination",
          totalpage: totalpage,
          page: page,
          data: Produk,
        });
      }
      res.send(error.message);
    } catch (error) {}
  },
  getProductid: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ProdukModel.finOne(id);
      res.json(data);
    } catch (error) {
      res.send(error.message);
    }
  },

  addProduct: async(req, res) => {
    try {
        redisClient.del("produk")
        multer.uploadsingle(req,res, async(err) => {
          try {
              if (err) {
                res.send(err);
              } else {
                const { id_category, title, harga } = req.body;
                const image = req.file.filename;
                console.log(image, title, harga);
                const add = await ProdukModel.addPRoduct(
                  title,
                  harga,
                  image,
                  id_category
                );
                res.json(add);
              }
          } catch (error) {
            res.send(error.message)
          }

        })
    } catch (error) {
      res.send(error.message)
    }
  },

  deleteProduk: async (req, res) => {
    try {
      redisClient.del("produk");
      const { id } = req.params;
      const finID = await ProdukModel.finOne(id);
      await fs.unlink(path.join(`public/images/${finID[0].image}`));
      const del = await ProdukModel.deleteProduk(id);
      res.json(del);
    } catch (error) {
      res.send(error.message);
    }
  },
  
  updateProduk: async (req, res) => {
    try {
      redisClient.del("produk");
      const { id } = req.params;
      const { title, harga, id_category } = req.body;
      const finID = await ProdukModel.finOne(id);
      const image = !req.file ? finID[0].image : req.file.filename;
      console.log(image);
      if (image === finID[0].image) {
        const Update = await ProdukModel.updateProduk(
          title,
          harga,
          image,
          id,
          id_category
        );  ``
        res.json(Update);
      } else {
        await fs.unlink(path.join(`public/images/${finID[0].image}`));
        const upd = await ProdukModel.updateProduk(
          title,
          harga,
          image,
          id,
          id_category
        );
        res.status(200).json(upd);
      }
    } catch (error) {
      res.send(err.message);
    }
  },

  getCategory: async (req, res) => {
    try {
      const getAll = await CategoryModel.getCategory();
      redisClient.set("category", JSON.stringify(getAll));
      res.json(getAll);
    } catch (error) {
      res.send(error.message);
    }
  },
  addCategory: async (req, res) => {
    try {
      redisClient.del("category");
      const { nama_category } = req.body;
      const insert = await CategoryModel.addCategory(nama_category);
      res.json(insert);
    } catch (error) {
      res.send(error.message);
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const del = await CategoryModel.deleteCategory(id);
      res.json(del);
    } catch (error) {
      res.send(error.message);
    }
  },
  editCategory: async (req, res) => {
    try {
      redisClient.del("category");
      const { id } = req.params;
      const { nama_category } = req.body;
      const update = await CategoryModel.editCategory(nama_category, id);
      res.json(update);
    } catch (error) {
      res.send(error.message);
    }
  },

  RegisterUser: async (req, res) => {
    try {
      let { email, password } = req.body;
      console.log(email, password);
      const findByEmail = await UserModel.findByEmail(email)
      const emails = findByEmail[0].emails;
      if(email === emails){
      return  res.send({
          message: "email has been registered"
        })
      }
      const codeVerif = crypto.randomBytes(20).toString("hex");
      password = bcrypt.hashSync(password, salt);
      const inssertUser = await UserModel.userRegister(
        email,
        password,
        codeVerif
      );
      res.json(inssertUser);
    } catch (error) {
      res.send({
        message: error.message
      });
    }
  },
  LoginUSer: async (req, res) => {
    try {
      const { email, password } = req.body;
      const findByemail = await UserModel.findByEmail(email);
      const hasPassword = findByemail[0].password;
      const emails = findByemail[0].emails;
      const role = findByemail[0].level
      console.log(role)
      console.log(email == emails);
      const level = findByemail[0].level;
      const Reff = findByemail[0].RefreshToken;
      refresh_token.push(Reff);

      const isMatch = bcrypt.compareSync(password, hasPassword);
      const refreshToken = jwt.sign(
        { email: email, level: level },
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!Reff) {
        await UserModel.refreshToken(refreshToken, emails);
      }
      // if(!verif || verif !== codeVerif ) res.send({message: 'please confiirmation your email !!!'})
      if (isMatch && findByemail) {
        jwt.sign(
          { email: emails, level: level },
          process.env.PrivateKEy,
          { expiresIn: 3600 },
          function (err, token) {
            if (err) {
              res.send(err);
            } else {
              if (!Reff) {
                res.json({
                  message: "berhasil login",
                  tokenLogin: token,
                  role: role,
                  refreshtoken: refreshToken,
                });
              } else {
                res.json({
                  message: "berhasil login",
                  tokenLogin: token,
                  refreshtoken: Reff,
                  role: role
                });
              }
            }
          }
        );
      } else {
        res.json({
          message: "username atau password salah",
        });
      }
    } catch (error) {
     res.status(500).send({
       message: error.message
     })
    }
  },
  refreshtoken: (req, res) => {
    try {
      const { token } = req.body;
      console.log(refresh_token);
      // if(token !== refresh_token) res.send({message: 'toket not found'})
      if (!token) return res.send({ message: "token must be required" });
      if (!refresh_token.includes(token))
        return res.status(500).send({ message: "toket not found" });
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if (err) {
          res.status(500).send(err);
        } else {
          const getNewtoken = jwt.sign(
            { email: user.email, level: user.level },
            process.env.PrivateKEy,
            { expiresIn: 30 }
          );
          res.json({
            token: getNewtoken,
          });
        }
      });
    } catch (error) {
      res.send(error.message);
    }
  },
  logoutUser: async (req, res) => {
    try {
      const { token } = req.body;
      await UserModel.logoutUser(token);
      if (!token) return res.send({ message: "token harus diisi" });
      if (!refresh_token.includes(token))
        return res.send({ message: "token not found" })
      res.send({ message: "berhasil logout" })
      console.log(refresh_token);
    } catch (error) {
      res.send(error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const delUSer = await UserModel.deleteUser(id);
      res.json(delUSer);
    } catch (error) {
      res.send(error.message);
    }
  },

  addMasterDetail: async (req, res) => {
    try {
      const aw = [];
      const { invoices, orders, amount, detail } = req.body;
      const data = await TransaksiModel.insertMaster(invoices, orders, amount);
      const asw = detail.map(async (dt) => {
        const id_produk = dt.id_product;
        const id_category = dt.id_category;
        const qty = dt.qty;
        const price = dt.price;
        const masterid = data.insertId;
        const insertDetail = await TransaksiModel.insertDetail(
          masterid,
          id_produk,
          id_category,
          qty,
          price
        );
        aw.push(insertDetail);
      });
      Promise.all(asw)
        .then(() => {
          res.send(aw);
        })
        .catch((err) => res.send(err));
    } catch (error) {}
  },
};       