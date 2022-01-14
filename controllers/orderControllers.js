const auth = require("./../auth");
const Order = require("./../models/Order");
const User = require("./../models/User");

module.exports.getAllOrders = () => {
	return Order.find()
		.then((result) => {
			return { orders: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.getAllOrdersByStatus = (status) => {
	return Order.find({ status: status })
		.then((result) => {
			return { orders: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.getUserOrders = (token) => {
	let userId = auth.decode(token).id;

	return Order.find({ userId: userId })
		.then((result) => {
			return { userOrders: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.getUserOrdersByStatus = (token, status) => {
	let userId = auth.decode(token).id;

	return Order.findOne({ userId: userId, status: status })
		.then((result) => {
			return { userOrders: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.changeOrderStatus = (id, reqBody) => {
	let { status } = reqBody;

	return Order.findByIdAndUpdate(id, { status: status })
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
};
