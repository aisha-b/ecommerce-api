
const express = require('express');
const router = express.Router();
const auth = require('./../auth');
const orderController = require('./../controllers/orderControllers');

router.get('/all', auth.adminVerify,  (req, res) => {

	orderController.getAllOrders().then(
		result => res.send(result));
})

router.get('/status/:status', auth.adminVerify,  (req, res) => {

	orderController.getAllOrdersByStatus(req.params.status).then(
		result => res.send(result));
})

router.get('/user-orders', auth.customerVerify, (req, res) => {

	orderController.getUserOrders(req.headers.authorization).then(
		result => res.send(result));
})

router.get('/status/:orderStatus/user-orders', auth.customerVerify, (req, res) => {

	orderController.getUserOrdersByStatus(req.headers.authorization, req.params.orderStatus).then(
		result => res.send(result));
})

router.put('/:orderId/change-status', auth.adminVerify, (req, res) => {

	orderController.changeOrderStatus(req.params.orderId, req.body).then(
		result => res.send(result));
})


module.exports = router;