const express = require("express");
const cors = require("cors");
const { sendResponse, KEY } = require("./utils");
const { data } = require("./data");
var jwt = require("jsonwebtoken");
require("dotenv").config();

const mongoose = require("mongoose");
const userModel = require("./db/model/user");

const app = express();
app.use(cors());

var url = process.env.MONGO_URL;

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
	console.log("DB Connected successfully");
});

app.get("/", async (req, res) => {
	try {
		let users = await userModel.aggregate([{ $sample: { size: 1 } }]);
		if (users.length < 1) {
			users = [data[Math.floor(Math.random() * data.length)]];
		}
		const item = users?.[0];
		const password = jwt.sign(item._id.toString(), KEY);
		return sendResponse(res, 200, password);
	} catch (err) {
		return sendResponse(res, 500, { msg: err, code: 500 });
	}
});

app.get("/:id", async (req, res) => {
	try {
		if (!req.params.id) {
			return sendResponse(res, 400, { msg: "Invalid Id", code: 400 });
		}
		const validId = jwt.verify(req.params.id, KEY);
		if (!validId || !parseInt(validId)) {
			return sendResponse(res, 400, { msg: "Invalid Id", code: 400 });
		}
		var id = mongoose.Types.ObjectId(validId);
		let users = await userModel.find({ _id: id });
		if (users?.length < 0) {
			users = data.find((item) => item.id === parseInt(validId));
		}
		let item = users?.[0];
		if (!item) {
			return sendResponse(res, 404, { msg: "Invalid Id", code: 400 });
		}
		let result = {
			id: item._id ?? item.id,
			name: item.name,
			phone: item.phone,
			address: item.address,
			city: item.city,
			location: item.location,
		};
		return sendResponse(res, 200, result);
	} catch (err) {
		return sendResponse(res, 500, { msg: err, code: 500 });
	}
});

app.listen(process.env.PORT || 3001, () => {
	console.log("Server running....");
});
