const express = require("express")
const router = express.Router()
const  apiController = require('../controllers/apiControllers')
const { uploadsingle, uploadMultiple } = require("../helpers/multer");
const auth = require('../helpers/auth');
const redis = require('../helpers/Redis')
const userAcces = require('../helpers/userAcces')





// History
// http://localhost:3000/admin/history
router.get('/history', apiController.getAllhistory)
router.post('/history', apiController.addHistory)
router.delete('/history/:id', apiController.deleteHistory)
router.put('/history/:id', apiController.updateHistory)


// produk
// ammarjoz09@gmail.com (kasir)
// ammarjoz10@gmail.com (admin)
router.get("/produk", auth.authentication, auth.authorization, redis.getProduk, apiController.getProduct);
router.get('/produk/:id', auth.authentication,auth.authorization, apiController.getProductid)
router.post('/produk', auth.authentication, auth.authorization, userAcces.accesAdmin,  apiController.addProduct)
router.delete('/produk/:id', auth.authentication, auth.authorization, userAcces.accesAdmin,  apiController.deleteProduk)
router.put('/produk/:id', auth.authentication, auth.authorization, userAcces.accesAdmin, uploadsingle, apiController.updateProduk)


// category
router.get('/category' ,  redis.getCategory, apiController.getCategory)
router.post('/category', apiController.addCategory)
router.delete('/category/:id', apiController.deleteCategory)
router.put('/category/:id', apiController.editCategory)


// users login register
router.post('/user/register', apiController.RegisterUser)
router.post('/user/login', apiController.LoginUSer)
router.post('/user/refreshToken', apiController.refreshtoken)
router.delete('/user/logout', apiController.logoutUser)
router.delete('/user/:id', apiController.deleteUser)



// transaksi
router.post ('/transaksi', apiController.addMasterDetail)

module.exports = router