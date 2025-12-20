import express from "express";
const router=express.Router()
import {addTowatchList} from "../controllers/watchListController.js"
router.post("/",addTowatchList)

export default router