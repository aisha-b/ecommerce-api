
const jwt = require('jsonwebtoken');
const secret = "ecommerceapi";

module.exports.createAccessToken = (user) => {

	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}

	return jwt.sign(data, secret, {});
}

module.exports.customerVerify = (req, res, next) => {

	let token = req.headers.authorization;

	if(typeof token !== "undefined") {

		token = token.slice(7);

		return jwt.verify(token, secret, (error, result) => {
			
			if(error) {
				return res.send(false);
			} else {

				let payload = jwt.decode(token, {complete: true}).payload;
				let isAdmin = payload.isAdmin;

				return isAdmin ? res.send(false) : next();
			}
		})
	}
}

module.exports.adminVerify = (req, res, next) => {

	let token =  req.headers.authorization;

	if(typeof token !== "undefined") {

		token = token.slice(7);

		return jwt.verify(token, secret, (error, result) => {

			if(error) {
				return res.send(false);
			} else {

				let payload = jwt.decode(token, {complete: true}).payload;
				let isAdmin = payload.isAdmin;

				return isAdmin ? next() : res.send(false);
			}
		})
	} else {
		res.send(false);
	}
}

module.exports.decode = (token) => {

	if(typeof token !== "undefined") {

		token = token.slice(7);

		return jwt.verify(token, secret, (error, result) =>
			error ? null : jwt.decode(token, {complete: true}).payload)
	}
}