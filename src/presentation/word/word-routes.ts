import { Router } from "express";
import { WordController } from "./word-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthService } from "../services/auth-service";

export class WordRoutes {

  static get routes(): Router {
    const router = Router();

    const authController = new WordController();

    const authService = new AuthService();
    const authMiddleware = new AuthMiddleware(authService);

    router.post(
      '/register',
      authMiddleware.validateJWT,
      authController.register
    );

    router.get(
      '/difficulty/:difficulty',
      authMiddleware.validateJWT,
      authController.getByDifficulty
    )

    return router;
  }
}