
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: [true, 'Product name is required']
	},

	imageURL: {
		type: String,
		required: [true, 'Product imageURL is required']
	},

	description: {
		type: String,
		required: [true, 'Product description is required']
	},

	price: {
		type: Number,
		required: [true, 'Price value is required']
	},

	specifications: [{
		_id: false,
		
		key: {
			type: String,
			required: [true, 'Key is required']
		},
		values: [{
			type: String,
			required: [true, 'Value is required']
		}]
	}],

	reviews: [{
		_id: false,

		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: [true, 'User ID is required']
		},

		comment:  {
			type: String,
			required: [true, 'Comment is required']
		},

		rating: {
			type: Number,
			required: [true, 'Rating is required'],
			min: 0,
			max: 100
		}
	}],

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