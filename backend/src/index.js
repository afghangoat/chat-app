
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import path from "path";
const __dirname = path.resolve();


import {connectDB} from "./lib/db.js";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import {app,server} from "./lib/socket.js";

dotenv.config();
//const app = express();

//For middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

const server_port=process.env.port;

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
	});
}

server.listen(server_port, () => {
	console.log(`Server is running on port ${server_port} !`);
	connectDB();
});
//console.log("refresh");