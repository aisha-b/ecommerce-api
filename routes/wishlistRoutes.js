
const express = require('express');
const router = express.Router();
const auth = require('./../auth');
const wishlistController = require('./../controllers/wishlistControllers');

router.get('/', auth.customerVerify, (req, res) => {

	wishlistController.getUserWishlist(req.headers.authorization).then(
		result => res.send(result));
})

router.put('/:productId/add', auth.customerVerify, (req, res) => {

	wishlistController.addItem(req.headers.authorization, req.params.productId).then(
		result => res.send(result));
})

router.delete('/:productId/remove', auth.customerVerify, (req, res) => {

	wishlistController.removeItem(req.headers.authorization, req.params.productId).then(
		result => res.send(result));
})

module.exports = router;