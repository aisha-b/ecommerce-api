const User = require("./../models/User");
const bcrypt = require("bcrypt");
const auth = require("./../auth");
const Order = require("./../models/Order");

module.exports.register = (reqBody) => {
	const { firstName, lastName, email, password, mobileNum } = reqBody;

	let newUser = new User({
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: bcrypt.hashSync(password, 10),
		mobileNum: mobileNum,
	});

	return User.findOne({ email: email }).then((result, error) => {
		if (error) {
			return { error: error.message };
		} else if (result == null) {
			return newUser.save().then(() => true);
		} else {
			return { message: "User already exists" };
		}
	});
};

module.exports.login = (reqBody) => {
	const { email, password } = reqBody;

	return User.findOne({ email: email }).then((result, error) => {
		if (error) {
			return { error: error.message };
		} else if (result !== null) {
			let isPasswordRight = bcrypt.compareSync(password, result.password);

			if (isPasswordRight) {
				return { access: auth.createAccessToken(result) };
			} else {
				return { message: "Incorrect password" };
			}
		} else {
			return { message: "Email doesn't exist" };
		}
	});
};

module.exports.getAllUsers = () => {
	return User.find().then((result, error) =>
		error ? { error: error.message } : { users: result }
	);
};

module.exports.getUserDetails = (token) => {
	let id = auth.decode(token).id;

	return User.findById(id)
		.then((result, error) => {
			if(error){
				return {error: error.message}
			} else {
				result.password = "";
				return { userDetails: result };
			}
		});
};

module.exports.changeDetails = (token, reqBody) => {
	let id = auth.decode(token).id;
	let { firstName, lastName, password, mobileNo, address } = reqBody;

	let newUserDetails = {
		firstName: firstName,
		lastName: lastName,
		password: bcrypt.hashSync(password, 10),
		mobileNum: mobileNo,
		address: address,
	};

	return User.findByIdAndUpdate(id, newUserDetails).then((result, error) =>
		result ? true : { error: error.message }
	);
};

module.exports.setUserAsAdmin = (userId) => {
	return User.findByIdAndUpdate(userId, { isAdmin: true }).then(
		(result, error) => (result ? true : { error: error.message })
	);
};

module.exports.checkOut = (token, reqBody) => {
	let userId = auth.decode(token).id;
	let { shippingAddress, shippingFee, discount } = reqBody;

	return User.findById(userId)
		.populate({
			path: "cart",
			populate: {
				path: "productId",
				match: { isActive: true },
			},
		})
		.then((result, error) => {
			let isCartEmpty = result.cart.length == 0;
			let areThereInactiveItems = result.cart.some((item) => {
				return item.productId == null;
			});

			if (error) {
				return { error: error.message };
			} else {
				if (isCartEmpty) {
					return { message: "Cart is empty" };
				} else if (areThereInactiveItems) {
					return { message: "Inactive items found in user cart" };
				} else {
					let newItems = [];
					result.cart.forEach((item) => {
						newItems.push({
							productId: item.productId._id,
							productPrice: item.productId.price,
							quantity: item.quantity,
							totalProductPrice:
								item.productId.price * item.quantity,
						});
					});

					let totalOrderPrice = 0;
					result.cart.forEach((item) => {
						totalOrderPrice += item.productId.price * item.quantity;
					});
					totalOrderPrice=totalOrderPrice + shippingFee - discount;

					let newOrder = new Order({
						userId: userId,
						items: newItems,
						totalOrderPrice: totalOrderPrice,
						shippingAddress: shippingAddress,
						shippingFee: shippingFee,
						discount: discount
					});

					return newOrder.save().then((order) => {
						let orderId = order._id;

						return User.findByIdAndUpdate(userId, {
							$set: { cart: [] },
						}).then((user) => {
							user.orders.push({ orderId: orderId });

							return user
								.save()
								.then((result, error) =>
									result ? true : { error: error.message }
								);
						});
					});
				}
			}
		});
};
