import { Router } from "express";
import { AuthRoutes } from "./auth/auth-routes";
import { WordRoutes } from "./word/word-routes";

export class AppRoutes {
  static get routes(): Router {

      const router = Router();

      router.use('/api/auth', AuthRoutes.routes ); //Ruta de los usuarios

      router.use('/api/word', WordRoutes.routes ); //Ruta de las palabras


      return router;
  }
}