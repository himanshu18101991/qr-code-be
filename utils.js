const KEY = "shhhhh";

const sendResponse = (res, status, body) => {
	return res.status(status).send({ body });
};

module.exports = {
	sendResponse,
	KEY,
};
