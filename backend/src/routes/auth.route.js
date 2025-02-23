console.log("this is fucking loaded 1");
import express from "express";

import {login,logout,signup,updateProfile,checkAuth} from "../controllers/auth.controller.js";

import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);

router.get("/debug", (req, res) => {
    res.send("Auth routes are working!");
});

router.get("/check",protectRoute,checkAuth);

export default router;