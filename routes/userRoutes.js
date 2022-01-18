
const express = require('express');
const router = express.Router();
const auth = require('./../auth');

const userController = require('./../controllers/userControllers');

router.get('/email-exists', (req, res) => {

	userController.checkEmail(req.body).then(
		result => res.send(result));
})

router.post('/register', (req, res) => {

	userController.register(req.body).then(
		result => res.send(result));
})

router.post('/login', (req, res) => {

	userController.login(req.body).then(
		result => res.send(result));
})

router.get('/', auth.adminVerify, (req, res) => {

	userController.getAllUsers().then(
		result => res.send(result));
})

router.get('/user-details', auth.userVerify, (req, res) => {
	
	userController.getUserDetails(req.headers.authorization).then(
		result => res.send(result));
})

router.put('/change-details', auth.customerVerify, (req, res) => {

	userController.changeDetails(req.headers.authorization, req.body).then(
		result => res.send(result));
})

router.put('/:userId/set-admin', auth.adminVerify, (req, res) => {

	userController.setUserAsAdmin(req.params.userId).then(
		result => res.send(result));
})

router.post('/checkout', auth.customerVerify, (req, res) => {

	userController.checkOut(req.headers.authorization, req.body).then(
		result => res.send(result));
})

module.exports = router;