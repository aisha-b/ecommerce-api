const auth = require("./../auth");
const User = require("./../models/User");
const Product = require("./../models/Product");

module.exports.getUserCart = (token) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.populate({
			path: "cart",
			populate: {
				path: "productId"
			}
		})
		.then((result) => result.cart)
		.catch((err) => {
			return { error: err };
		});
};

module.exports.addItem = (token, productId) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.then((user) => {
			if (user !== null) {
				let isItemOnCart = user.cart.some(
					(item) => item.productId == productId
				);

				if (isItemOnCart) {
					return { message: "Item already in cart" };
				} else {
					return Product.findById(productId).then((result) => {
						if (result.isActive === true) {
							user.cart.push({
								productId: productId,
								quantity: 1,
							});

							return user.save().then(() => true);
						} else if (result.isActive === false) {
							return { error: "Product is not available" };
						}
					});
				}
			} else {
				return { message: "User not found" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.changeQuantity = (token, productId, reqBody) => {
	let userId = auth.decode(token).id;
	let quantity = reqBody.quantity;

	return User.findById(userId)
		.then((result) => {
			if (result !== null) {
				let isItemOnCart = result.cart.some((item) => {
					return item.productId == productId;
				});

				if (isItemOnCart) {
					result.cart.forEach((item) => {
						if (item.productId == productId) {
							item.quantity = quantity;
						}
					});

					return result.save().then(() => true);
				} else {
					return { message: "Item not found in user cart" };
				}
			} else {
				return { message: "User not found" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.removeItem = (token, productId) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.then((result) => {
			if (result !== null) {
				let itemIndex = -1;

				result.cart.forEach((item, index) => {
					if (item.productId == productId) {
						itemIndex = index;
					}
				});

				let isItemInCart = itemIndex !== -1;

				if (isItemInCart) {
					result.cart.splice(itemIndex, 1);

					return result.save().then(() => true);
				} else {
					return { message: "Item not found in cart" };
				}
			} else {
				return { message: "User not found" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};
