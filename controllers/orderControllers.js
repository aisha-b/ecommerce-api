
const auth = require('./../auth');
const Order = require('./../models/Order');
const User = require('./../models/User');

module.exports.getAllOrders = () => {

	return Order.find().then((result, error) =>
		error ? error : result);
}

module.exports.getAllOrdersByStatus = (status) => {

	return Order.find({status: status}).then((result, error) =>
		error ? error : result);
}

module.exports.getUserOrders = (token) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).populate({
		path: "orders",
		populate: {
			path: "orderId"
		}
	}).then((result, error) =>
		error ? error : result.orders);
}

module.exports.getUserOrdersByStatus = (token, status) => {

	let userId = auth.decode(token).id;

	return Order.find({userId: userId, status: status}).then((result, error) =>
		error ? error : result);
}

module.exports.changeOrderStatus = (id, reqBody) => {

	let {status} = reqBody;

	return Order.findByIdAndUpdate(id, {status: status}).then((result, error) =>
		error ? error : true);
}