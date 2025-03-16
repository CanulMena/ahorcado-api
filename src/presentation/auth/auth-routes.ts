import { Router } from "express";
import { AuthController } from "./auth-controller";
import { AuthService } from "../services/auth-service";
import { AuthMiddleware } from "../middlewares/auth-middleware";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const authService = new AuthService();
    const authMiddleware = new AuthMiddleware(authService);

    const authController = new AuthController();

    router.post(
      '/register',
      authMiddleware.validateJWT,
      authController.register
    );

    router.post(
      '/login',
      authController.login
    );


    return router;
  }
}