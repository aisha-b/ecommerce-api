
const auth = require('./../auth');
const User = require('./../models/User');
const Product = require('./../models/Product');

module.exports.getUserCart = (token, productId) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).populate({
			path: "cart",
			populate: {
				path: "productId",
				match: {isActive: true}
			}
		}).then( result => {

			result.cart.forEach((item,index) => {
				if(item.productId == null){
					result.cart.splice(index, 1);
				}
			})

			return result.save().then(result => result.cart);
		});
}

module.exports.addItem = (token, productId) => {

	let userId = auth.decode(token).id;

	return User.findById(userId).then((result, error) => {

		if(error) {
			return error;
		} else {

			let isItemOnCart = result.cart.some(item => item.productId == productId);
			
			if(isItemOnCart) {
				return {error: "Item already in cart"};
			} else {

				return Product.findById(productId).then((result, error) => {

					if(error) {
						return error;
					} else if(result.isActive === true) {

						return User.findById(userId).then((result, error) => {

									if(error) {
										return error;
									} else {

										result.cart.push({productId: productId, quantity: 1});

										return result.save().then((result, error) =>
											error ? error : true);
									}
								})

					} else if(result.isActive === false) {
						return {error: "Product is not available"};
					}
				})
			}
		}
	})

}


module.exports.changeQuantity = (token, productId, reqBody) => {

	let userId = auth.decode(token).id;
	let quantity = reqBody.quantity;

	return User.findById(userId).then((result, error) => {

		if(error) {
			return error;
		} else {

			result.cart.forEach(item => {

				if(item.productId == productId) {
					item.quantity = quantity;
				}
			})

			return result.save().then((result, error) =>
				error ? error : true);
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
			result.cart.forEach((item, index) => {

				if(item.productId == productId) {
					itemIndex = index;
				}
			})

			result.cart.splice(itemIndex, 1);

			return result.save().then((result, error) =>
				error ? error : true);
		}
	})
}


