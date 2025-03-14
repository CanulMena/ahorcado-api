import { Router } from "express";
import { AuthController } from "./auth-controller";

export class AuthRoutes {

  static get routes(): Router {
    const router = Router();

    const authController = new AuthController(
    );

    router.post(
      '/register',
      authController.registerUser
    );

    router.get(
      '/get-all',
      authController.getAll
    )

    return router;
  }
}