import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const uploadimg = async(pic) => {
	//TODO pic is base64, upload to servers and access it
	console.log("Implement imageuploader!");
	return {
		secure_url: "https://afghangoat.hu/img/img5.png"
	};
};