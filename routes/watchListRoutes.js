import express from "express";
const router=express.Router()
import watchListController from "../controllers/watchListController.js";
import authMiddleware from "../middleware/authMiddleware.js";
router.use(authMiddleware)
router.post("/",watchListController.addToWatchList)

export default router