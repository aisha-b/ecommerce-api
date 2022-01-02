
const Product = require('./Product');
const Order = require('./Order');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

	firstName: {
		type: String,
		required: [true, 'First name is required']
	},

	lastName: {
		type: String,
		required: [true, 'Last name is required']
	},

	email: {
		type: String,
		required: [true, 'Email is required']
	},

	password: {
		type: String,
		required: [true, 'Password is required']
	},

	isAdmin: {
		type: Boolean,
		default: false
	},

	mobileNo: {
		type: String,
		required: [true, 'Mobile no. is required']
	},

	address: {
		street: String,
		barangay: String,
		city: String,
		province: String,
		zip: Number,
		country: String
	},

	wishlist: [{
		type: mongoose.Schema.Types.ObjectId,
      	ref: 'Product'
	}],

	cart: [{

		productId: {
			type: mongoose.Schema.Types.ObjectId,
      		ref: 'Product'
		},

		quantity: {
			type: Number,
			required: [true, 'Quantity is required']
		}
	}],

	orders: [{

		orderId: {
			type: mongoose.Schema.Types.ObjectId,
      		ref: 'Order'
		},

		purchasedOn: {
			type: Date,
			default: new Date()
		}
	}]
})

module.exports = mongoose.model("User", userSchema);