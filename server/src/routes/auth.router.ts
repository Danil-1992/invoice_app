import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/refresh", AuthController.refresh);
router.delete("/logout", AuthController.logout);

export default router;