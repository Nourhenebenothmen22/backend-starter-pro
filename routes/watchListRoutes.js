import express from "express";
const router=express.Router()
import {addTowatchList} from "../controllers/watchListController.js"
import authMiddleware from "../middleware/authMiddleware.js";
router.use(authMiddleware)
router.post("/",addTowatchList)

export default router