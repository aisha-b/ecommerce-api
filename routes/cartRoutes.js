
const express = require('express');
const router = express.Router();
const auth = require('./../auth');
const cartController = require('./../controllers/cartControllers');

router.get('/', auth.customerVerify, (req, res) => {

	cartController.getUserCart(req.headers.authorization).then(
		result => res.send(result));
})

router.put('/:productId/add', auth.customerVerify, (req, res) => {

	cartController.addItem(req.headers.authorization, req.params.productId).then(
		result => res.send(result));
})

router.put('/:productId/change-quantity', auth.customerVerify, (req, res) => {

	cartController.changeQuantity(req.headers.authorization, req.params.productId, req.body).then(
		result => res.send(result));
})

router.delete('/:productId/remove', auth.customerVerify, (req, res) => {

	cartController.removeItem(req.headers.authorization, req.params.productId).then(
		result => res.send(result));
})

router.get('/:productId/check', auth.customerVerify, (req, res) => {

	cartController.checkItem(req.headers.authorization, req.params.productId).then(
		result => res.send(result));
})

module.exports = router;