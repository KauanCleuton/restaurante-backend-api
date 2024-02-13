import { Router } from "express";
import userController from "../controllers/user.controller";
import auth from "../middleware/auth";
import adminController from "../controllers/admin.controller";

const routes = Router()


// Rotas de autenticação
routes.post("/register", userController.registerUser)
routes.post("/login", userController.login)
routes.get("/refresh-token", auth.verifyToken, userController.newAccessToken)


// rotas de admin
routes.get("/private", auth.verifyToken, auth.verifyAdmin,adminController.rotaPrivada)
routes.get("/users", auth.verifyToken, auth.verifyAdmin,adminController.listUser)
routes.post("/create-admin", auth.verifyToken, auth.verifyAdmin, adminController.createAdmin)

export default routes