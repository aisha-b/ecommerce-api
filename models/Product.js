
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Product name is required']
	},

	image: {
		name: String,
		src: String
	},

	description: {
		type: String,
		required: [true, 'Product description is required']
	},

	type: {
		type: String,
		required: [true, 'Product type is required']
	},

	price:  {
		type: Number,
		required: [true, 'Product price is required']
	},

	isActive: {
		type: Boolean,
		default: true
	},

	createdOn: {
		type: Date,
		default: new Date()
	}
})

module.exports = mongoose.model("Product", productSchema);