import { Request, Response, Router } from "express";
import { useMySql } from "../database/database";
import * as userControllers from "../controllers/controllers_users";


export const router: Router = Router();

// api/users
router.post("/register", userControllers.registerUser);

router.post("/login", userControllers.loginUser);

router.get("/logout", userControllers.logoutUser);