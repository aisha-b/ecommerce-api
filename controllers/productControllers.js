
const Product = require('./../models/Product');
const auth = require('./../auth');

module.exports.getAllProducts = () => {

	return Product.find().then((result, error) => 
		error ? error : result);
}

module.exports.getActiveProducts = () => {

	return Product.find({isActive: true}).then((result, error) => 
		error ? error : result);
}

module.exports.getActiveProductsByType = (type) =>  {
	
	return Product.find({isActive: true, type: type}).then((result, error) => 
		error ? error : result);
}

module.exports.getProduct = (id) => {

	return Product.findById(id).then((result, error) =>
		error ? error : result);
}

module.exports.createProduct = (reqBody) => {

	let newProduct = new Product(reqBody);

	return newProduct.save().then((result, error) =>
		error ? error : true);
}

module.exports.updateProduct = (id, reqBody) => {

	let {name, image, description, price, type} = reqBody;

	let newProductDetails = {
		name: name,
		image: image,
		description: description,
		price: price,
		type: type
	}

	return Product.findByIdAndUpdate(id, newProductDetails).then((result, error) =>
		error ? error : true);
}

module.exports.deleteProduct = (id) => {

	return Product.findByIdAndDelete(id).then((result, error) =>
		error ? error : true);
}

module.exports.archiveProduct = (id) => {

	return Product.findByIdAndUpdate(id, {isActive: false}).then((result, error) =>
		error ? error : true);
}

module.exports.unarchiveProduct = (id) => {

	return Product.findByIdAndUpdate(id, {isActive: true}).then((result, error) =>
		error ? error : true);
}