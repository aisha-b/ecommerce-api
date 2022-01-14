const Product = require("./../models/Product");
const Order = require("./../models/Order");
const auth = require("./../auth");

module.exports.getAllProducts = () => {
	return Product.find()
		.then((result) => {
			return { products: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.getActiveProducts = () => {
	return Product.find({ isActive: true })
		.then((result) => {
			return { activeProducts: result };
		})
		.catch((err) => {
			return { error: err };
		});
};

module.exports.getProduct = (id) => {
	return Product.findById(id)
		.then((result) => {
			return { product: result };
		})
		.catch((err) => {
			return { error: err };
		});
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
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
};

module.exports.updateProduct = (id, reqBody) => {
	let { name, imageURL, description, price, specifications } = reqBody;

	let updatedProductDetails = {
		name: name,
		imageURL: imageURL,
		description: description,
		price: price,
		specifications: specifications,
	};

	return Product.findByIdAndUpdate(id, updatedProductDetails)
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
};

module.exports.deleteProduct = (id) => {
	return Product.findByIdAndDelete(id)
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
};

module.exports.archiveProduct = (id) => {
	return Product.findByIdAndUpdate(id, { isActive: false })
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
};

module.exports.unarchiveProduct = (id) => {
	return Product.findByIdAndUpdate(id, { isActive: true })
		.then(() => true)
		.catch((err) => {
			return { error: err };
		});
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
	})
		.then((result) => {
			if (result !== null) {
				return Product.findById(productId).then((result) => {
					if (result !== null) {
						result.reviews.push(newReview);
						return result.save().then(() => true);
					} else {
						return { message: "Product not found" };
					}
				});
			} else {
				return { message: "Product not found in user order history" };
			}
		})
		.catch((err) => {
			return { error: err };
		});
};
