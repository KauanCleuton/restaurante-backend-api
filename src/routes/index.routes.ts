import { Router } from "express";
import userController from "../controllers/user.controller";

const router = Router()

router.post("/register", userController.registerUser)
router.get("/users", userController.listUser)

export default router