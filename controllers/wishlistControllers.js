const auth = require("./../auth");
const User = require("./../models/User");

module.exports.getUserWishlist = (token) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.then((result) => {
			if (result !== null) {
				return { userWishList: result.wishlist };
			} else {
				return { message: "User not found" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.addItem = (token, productId) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.then((result) => {
			if (result !== null) {
				let isItemOnWishlist = result.wishlist.some(
					(item) => item == productId
				);

				if (isItemOnWishlist) {
					return { message: "Item already in wishlist" };
				} else {
					result.wishlist.push(productId);

					return result.save().then(() => true);
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
				let itemIndex = result.wishlist.indexOf(productId);
				let isItemInWishlist = itemIndex !== -1;

				if (isItemInWishlist) {
					result.wishlist.splice(itemIndex, 1);

					return result.save().then(() => true);
				} else {
					return { message: "Item not found in wishlist" };
				}
			} else {
				return { message: "User not found" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};
