import { Router } from "express";
import { GameController } from './game-controller';
import { AuthService } from "../services/auth-service";
import { AuthMiddleware } from "../middlewares/auth-middleware";

export class GameRoutes {

  static get routes(): Router {
    const router = Router();

    const authService = new AuthService();
    const authMiddleware = new AuthMiddleware(authService);

    const gameController = new GameController();

    router.post(
      '/register',
      authMiddleware.validateJWT,
      gameController.register
    );

    router.get(
      '/rankingGeneral',
      authMiddleware.validateJWT,
      gameController.ranking
    )

    return router;
  }
}