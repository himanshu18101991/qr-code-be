const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	city: {
		type: String,
		required: false,
	},
	location: {
		type: String,
		required: false,
	},
	area: {
		type: String,
		required: false,
	},
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
