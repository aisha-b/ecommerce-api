
const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productControllers');
const auth = require('./../auth');

router.get('/', (req, res) => {

	productController.getAllProducts().then(
		result => res.send(result));
})

router.get('/active', (req, res) => {

	productController.getActiveProducts().then(
		result => res.send(result));
})

router.get('/:type/active', (req, res) => {

	productController.getActiveProductsByType(req.params.type).then(
		result => res.send(result));
})

router.get('/:productId/get', (req, res) => {

	productController.getProduct(req.params.productId).then(
		result => res.send(result));
})

router.post('/create', auth.adminVerify, (req, res) => {

	productController.createProduct(req.body).then(
		result => res.send(result));
})

router.put('/:productId/update', auth.adminVerify, (req, res) => {

	productController.updateProduct(req.params.productId, req.body).then(
		result => res.send(result));
})

router.delete('/:productId/delete', auth.adminVerify, (req, res) => {

	productController.deleteProduct(req.params.productId, req.body).then(
		result => res.send(result));
})

router.put('/:productId/archive', auth.adminVerify, (req, res) => {

	productController.archiveProduct(req.params.productId).then(
		result => res.send(result));
})

router.put('/:productId/unarchive', auth.adminVerify, (req, res) => {

	productController.unarchiveProduct(req.params.productId).then(
		result => res.send(result));
})

module.exports = router;