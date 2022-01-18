
const mongoose = require('mongoose');
const Product = require('./Order');
const User = require('./User');

const orderSchema = new mongoose.Schema({

	userId: {
		type: mongoose.Schema.Types.ObjectId,
      	ref: 'User'
	},

	items: [{
		_id: false,

		productId: {
			type: mongoose.Schema.Types.ObjectId,
      		ref: 'Product'
		},

		productPrice: {
			type: Number,
			required: [true, 'Product price is required']
		},

		quantity: {
			type: Number,
			required: [true, 'Quantity is required']
		},

		totalProductPrice: {
			type: Number,
			required: [true, 'Total product price is required']			
		}

	}],

	discount: {
		type: Number,
		default: 0
	},

	shippingFee: {
		type: Number,
		default: 0
	},

	totalOrderPrice: {
		type: Number,
		required: [true, 'Total order price is required']
	},

	shippingAddress: {
		_id: false,
		
		street: {
			type: String,
			required: [true, 'Street is required']
		},
		city: {
			type: String,
			required: [true, 'City is required']
		},
		zip: {
			type: Number,
			required: [true, 'ZIP code is required']
		},
		country: {
			type: String,
			required: [true, 'Country is required']
		}
	},

	modeOfPayment: {
		type: String,
		default: "Cash on delivery"
	},

	status: {
		type: String,
		default: "pending"
	},

	purchasedOn: {
		type: Date,
		default: new Date()
	}

})

module.exports = mongoose.model("Order", orderSchema);