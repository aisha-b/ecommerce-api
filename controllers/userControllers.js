
const User = require('./../models/User');
const bcrypt = require('bcrypt');
const auth = require('./../auth');
const Order = require('./../models/Order');

module.exports.register = (reqBody) => {

	const {firstName, lastName, email, password, mobileNo} = reqBody;

	let newUser = new User({
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: bcrypt.hashSync(password, 10),
		mobileNo: mobileNo
	})

	return User.findOne({email: email}).then((result, error) => {
		
		if(error) {
			return error;
		} else {
			if(result !== null){
				return {error: "User already exists"};
			} else {
				return newUser.save().then((result, error) =>
				error ? error : true);
			}
		}
	})


}

module.exports.login = (reqBody) => {

	const {email, password} = reqBody;

	return User.findOne({email: email}).then((result, error) => {

		if(error) {
			return error;
		} else if(result == null) {
			return {error: "Email doesn't exist"};
		} else {

			let isPasswordRight = bcrypt.compareSync(
				password, result.password);

			if(isPasswordRight) {
				return {access: auth.createAccessToken(result)};
			} else {
				return {error: "Incorrect password"};
			}
		}
	})
}

module.exports.getAllUsers = () => {

	return User.find().then((result, error) => 
		error ? error : result);
}

module.exports.getUserDetails = (token) => {

	let id = auth.decode(token).id;

	return User.findById(id).then((result, error) =>
		error ? error : result);
}

module.exports.changeDetails = (token, reqBody) => {

	let id = auth.decode(token).id;
	let {firstName, lastName, password, mobileNo, address} = reqBody;

	let newUserDetails = {
		firstName: firstName,
		lastName: lastName,
		password: bcrypt.hashSync(password, 10),
		mobileNo: mobileNo,
		address: address
	}

	return User.findByIdAndUpdate(id, newUserDetails).then((result, error) =>
		error ? error : true);
}

module.exports.setUserAsAdmin = (userId) => {

	return User.findByIdAndUpdate(userId, {isAdmin: true}).then((result, error) =>
		error ? error : true);
}

module.exports.checkOut = (token, reqBody) => {

	let userId = auth.decode(token).id;
	let {shippingAddress} = reqBody;

	return User.findById(userId).populate({
			path: "cart",
			populate: {
				path: "productId"
			}
		}).then((result, error) => {

			if(error) {
				return error;
			} else {

				if(result.cart.length == 0){
					return {error: "Cart is empty"};
				} else {

					let newItems = [];
					result.cart.forEach(item => {

						newItems.push({
							productId: item.productId._id,
							productPrice: item.productId.price,
							quantity: item.quantity,
							totalProductPrice: (item.productId.price * item.quantity)
						})
					})

					let totalOrderPrice = 0;
					result.cart.forEach(item => {

						totalOrderPrice += item.productId.price * item.quantity;
					})

					let newOrder = new Order({
						userId: userId,
						items: newItems,
						totalOrderPrice: totalOrderPrice,
						shippingAddress: shippingAddress
					})

					return newOrder.save().then((result, error) =>
						error ? error : result )
					.then((order, error) => {

						if(error) {
							return error;
						} else {
							let orderId = order._id;

							return User.findByIdAndUpdate(userId, {$set: {cart: []}}).then((user, error) => {

								user.orders.push({orderId: orderId});

								return user.save().then(result => true);
							})
						}
					})

				}
			}
		})

}

