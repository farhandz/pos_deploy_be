const express = require('express')
const adminControllers = require('../controllers/adminControllers')
const router = express.Router()
const { uploadsingle, uploadMultiple } = require("../helpers/multer");
const { route } = require('.');

// dashboard
router.get('/dashboard', adminControllers.viewDashboard)

// category
router.get('/category', adminControllers.viewCategory )
router.get('/category/:id', adminControllers.viewCategoryid)
router.post('/category', adminControllers.addCategory)
router.delete('/category/:id', adminControllers.deleteCategory)
router.put('/category/:id', adminControllers.Updatecategory)


// produk
router.get('/produk', adminControllers.viewProduk)
router.get('/produk/:id', adminControllers.viewProdukid)
router.post('/produk',  uploadsingle, adminControllers.addProduk)
router.delete('/produk/:id', adminControllers.deleteProduk)
router.put('/produk/:id', uploadsingle, adminControllers.updateProduk)


// history
router.get('/history', adminControllers.viewHIstory)
router.get('/history/:id', adminControllers.viewHIstoryid)
router.post('/history', adminControllers.addHistory)
router.delete('/history/:id', adminControllers.deletehistory)
router.put('/history/:id', adminControllers.updateHIstory )

module.exports = router