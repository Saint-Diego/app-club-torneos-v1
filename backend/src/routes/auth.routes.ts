import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validateBody } from "../middlewares/validate.middleware";
import { RegisterSchema, LoginSchema } from "../schemas/validation.schemas";

const router = Router();
router.post("/register", validateBody(RegisterSchema), register);
router.post("/login", validateBody(LoginSchema), login);
export default router;
