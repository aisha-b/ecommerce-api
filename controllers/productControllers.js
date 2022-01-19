const Product = require("./../models/Product");
const Order = require("./../models/Order");
const auth = require("./../auth");

module.exports.getAllProducts = () => {
	return Product.find().then((result, error) =>
		error ? { error: error.message } : { products: result }
	);
};

module.exports.getActiveProducts = () => {
	return Product.find({ isActive: true }).then((result, error) =>
		error ? { error: error.message } : { activeProducts: result }
	);
};

module.exports.getProduct = (id) => {
	return Product.findById(id).then((result, error) =>
		error ? { error: error.message } : { product: result }
	);
};

module.exports.createProduct = (reqBody) => {
	let { name, imageURL, description, price, specifications } = reqBody;

	let newProductDetails = {
		name: name,
		imageURL: imageURL,
		description: description,
		price: price,
		specifications: specifications,
	};

	let newProduct = new Product(newProductDetails);

	return newProduct
		.save()
		.then((result, error) => (result ? true : { error: error.message }));
};

module.exports.updateProduct = (id, reqBody) => {
	let { name, imageURL, description, price, specifications } = reqBody;

	let updatedProductDetails = {
		name: name,
		imageURL: imageURL,
		description: description,
		price: price,
		specifications:specifications
	};

	return Product.findByIdAndUpdate(id, updatedProductDetails).then((result, error) =>
		error ? error : true
	);
};

module.exports.deleteProduct = (id) => {
	return Product.findByIdAndDelete(id).then((result, error) =>
		error ? false : true
	);
};

module.exports.archiveProduct = (id) => {
	return Product.findByIdAndUpdate(id, { isActive: false }).then((result, error) =>
		error ? false : true
	);
};

module.exports.unarchiveProduct = (id) => {
	return Product.findByIdAndUpdate(id, { isActive: true }).then((result, error) =>
		error ? false : true
	);
};

module.exports.addProductReview = (token, productId, reqBody) => {
	let userId = auth.decode(token).id;

	let newReview = {
		userId: userId,
		comment: reqBody.comment,
		rating: reqBody.rating,
	};

	return Order.findOne({
		userId: userId,
		items: { $elemMatch: { productId: productId } },
	}).then((result, error) => {
		if (error) {
			return { error: error.message };
		} else if (result !== null) {
			return Product.findById(productId).then((result) => {
				if (result !== null) {
					return Product.find({
						_id: productId,
						reviews: { $elemMatch: { userId: userId } },
					}).then((result) => {
						if (result == null) {
							result.reviews.push(newReview);
							return result
								.save()
								.then((result, error) =>
									result ? true : { error: error.message }
								);
						} else {
							return { message: "User already gave a review" };
						}
					});
				} else {
					return { message: "Product not found" };
				}
			});
		} else {
			return { message: "Product not found in user order history" };
		}
	});
};
