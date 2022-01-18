const auth = require("./../auth");
const User = require("./../models/User");

module.exports.getUserWishlist = (token) => {
	let userId = auth.decode(token).id;

	return User.findById(userId)
		.populate("wishlist")
		.then((result, error) =>
			error ? { error: error.message } : { wishlist: result.wishlist }
		);
};

module.exports.addItem = (token, productId) => {
	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) => {
		if (error) {
			return { error: error.message };
		} else {
			let isItemOnWishlist = result.wishlist.some(
				(item) => item == productId
			);

			if (isItemOnWishlist) {
				return { message: "Item already in wishlist" };
			} else {
				result.wishlist.push(productId);

				return result
					.save()
					.then((result, error) =>
						result ? true : { error: error.message }
					);
			}
		}
	});
};

module.exports.removeItem = (token, productId) => {
	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) => {
		if (error) {
			return { error: error.message };
		} else {
			let itemIndex = result.wishlist.indexOf(productId);
			let isItemInWishlist = itemIndex !== -1;

			if (isItemInWishlist) {
				result.wishlist.splice(itemIndex, 1);

				return result
					.save()
					.then((result, error) =>
						result ? true : { error: error.message }
					);
			} else {
				return { message: "Item not found in wishlist" };
			}
		}
	});
};
