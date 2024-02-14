import { Router } from "express";
import userController from "../controllers/auth.controller";
import auth from "../middleware/auth";
import adminController from "../controllers/admin.controller";
import authController from "../controllers/auth.controller";

const routes = Router()


// Rotas de autenticação
routes.post("/register", userController.registerUser)
routes.post("/login", userController.login)
routes.post("/refresh-token", auth.refreshToken)
routes.get("/logout", auth.verifyToken, authController.logout)

// rotas de admin
routes.get("/private", auth.verifyToken, auth.verifyAdmin, auth.verifyLogged, adminController.rotaPrivada)
routes.get("/users", auth.verifyToken, auth.verifyAdmin, auth.verifyLogged, adminController.listUser)
routes.post("/create-admin", auth.verifyToken, auth.verifyAdmin, auth.verifyLogged, adminController.createAdmin)
routes.post("/add-menu", auth.verifyToken, auth.verifyAdmin, auth.verifyLogged, adminController.createMenu)

export default routes