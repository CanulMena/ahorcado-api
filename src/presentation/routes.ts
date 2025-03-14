import { Router } from "express";
import { AuthRoutes } from "./auth/auth-routes";

export class AppRoutes {
  static get routes(): Router {

      const router = Router();

      router.use('/api/auth', AuthRoutes.routes); //Ruta de los usuarios


      return router;
  }
}