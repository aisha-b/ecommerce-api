
const auth = require('./../auth');
const User = require('./../models/User');

module.exports.getUserWishlist = (token, productId) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) =>
		error ? error : result.wishlist)
}

module.exports.addItem = (token, productId) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) => {

		if(error) {
			return error;
		} else {

			let isItemOnWishlist = result.wishlist.some(item => item == productId);
			
			if(isItemOnWishlist) {
				return {error: "Item already in wishlist"};
			} else {

				return User.findById(userId).then((result, error) => {

					if(error) {
						return error;
					} else {

						result.wishlist.push(productId);

						return result.save().then((result, error) =>
							error ? error : true);
					}
				})
			}
		}
	})


}

module.exports.removeItem = (token, productId) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) => {

		if(error) {
			return error;
		} else {

			let itemIndex;
			result.wishlist.forEach((item, index) => {

				if(item.productId == productId) {
					itemIndex = index;
				}
			})

			result.wishlist.splice(itemIndex, 1);

			return result.save().then((result, error) =>
				error ? error : true);
		}
	})
}
