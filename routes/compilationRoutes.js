import express from "express";
import { cppCompilation } from "../controllers/compilationController.js";

const router = express.Router();
router.post("/", cppCompilation);

export default router;
