const express = require("express");
const cors = require("cors");
const { sendResponse, KEY } = require("./utils");
const { data } = require("./data");
var jwt = require("jsonwebtoken");

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
	try {
		const item = data[Math.floor(Math.random() * data.length)];
		const password = jwt.sign(item.id, KEY);
		return sendResponse(res, 200, password);
	} catch (err) {
		return sendResponse(res, 500, { msg: err, code: 400 });
	}
});

app.get("/:id", (req, res) => {
	try {
		if (!req.params.id) {
			return sendResponse(res, 400, { msg: "Invalid Id", code: 400 });
		}
		const validId = jwt.verify(req.params.id, KEY);
		if (!validId || !parseInt(validId)) {
			return sendResponse(res, 400, { msg: "Invalid Id", code: 400 });
		}
		const item = data.find((item) => item.id === parseInt(validId));
		if (!item) {
			return sendResponse(res, 404, { msg: "Invalid Id", code: 400 });
		}
		return sendResponse(res, 200, item);
	} catch (err) {
		return sendResponse(res, 500, { msg: err, code: 500 });
	}
});

app.listen(3001, () => {
	console.log("Server running....");
});
