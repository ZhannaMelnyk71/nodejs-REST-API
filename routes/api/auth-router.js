import express from "express";

import authController from "../../controllers/auth-controller.js";

import usersSchemas from "../../schemas/users-schemas.js";

import { validateBody } from "../../decorators/index.js";

import {upload, authenticate} from "../../middlewares/index.js";

const authRouter = express.Router();

// authRouter.post("/signup", validateBody(usersSchemas.userSignupSchema), authController.signup);

// authRouter.post("/signin", validateBody(usersSchemas.userSigninSchema), authController.signin);

authRouter.post("/register", validateBody(usersSchemas.userSignupSchema), authController.signup);

authRouter.post("/login", validateBody(usersSchemas.userSigninSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

// authRouter.post("/signout", authenticate, authController.signout);
authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch("/avatars",authenticate,upload.single("avatar"), authController.updateAvatar);

export default authRouter;