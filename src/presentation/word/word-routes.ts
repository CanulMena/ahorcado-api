import { Router } from "express";
import { WordController } from "./word-controller";

export class WordRoutes {

  static get routes(): Router {
    const router = Router();

    const authController = new WordController();

    router.post(
      '/register',
      authController.register
    );


    return router;
  }
}