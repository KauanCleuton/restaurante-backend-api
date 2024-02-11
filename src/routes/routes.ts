import { Router } from "express";
import userController from "../controllers/user.controller";

const routes = Router()

routes.post("/register", userController.registerUser)
routes.get("/users", userController.listUser)

export default routes