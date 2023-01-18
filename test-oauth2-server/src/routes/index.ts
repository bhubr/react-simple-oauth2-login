import express from "express";

import auth from "./auth";
import home from "./home";
import api from "./api";

const router = express.Router();

router.use("/auth", auth);
router.use("/api", api);
router.use("/", home);

export default router;
