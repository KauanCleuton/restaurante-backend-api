import { Router } from "express";
import userController from "../controllers/user.controller";
import auth from "../utils/auth";

const routes = Router()

routes.post("/register", userController.registerUser)
routes.get("/users", userController.listUser)
routes.post("/login", userController.login)
routes.get("/private", auth.verifyToken, userController.rotaPrivada)


routes.get("/refresh-token", auth.verifyToken, userController.newAccessToken)


export default routes