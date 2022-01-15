const auth = require("./../auth");
const Order = require("./../models/Order");
const User = require("./../models/User");

module.exports.getAllOrders = () => {
	return Order.find().then((result, error) =>
		error ? { error: error.message } : { orders: result }
	);
};

module.exports.getAllOrdersByStatus = (status) => {
	return Order.find({ status: status }).then((result, error) =>
		error ? { error: error.message } : { orders: result }
	);
};

module.exports.getUserOrders = (token) => {
	let userId = auth.decode(token).id;

	return Order.find({ userId: userId }).then((result, error) =>
		error ? { error: error.message } : { userOrders: result }
	);
};

module.exports.getUserOrdersByStatus = (token, status) => {
	let userId = auth.decode(token).id;

	return Order.findOne({ userId: userId, status: status }).then((result, error) =>
		error ? { error: error.message } : { userOrders: result }
	);
};

module.exports.changeOrderStatus = (id, reqBody) => {
	let { status } = reqBody;

	return Order.findByIdAndUpdate(id, { status: status }).then(
		(result, error) => (result ? true : { error: error.message })
	);
};
