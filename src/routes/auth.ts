import express from "express";
import passport from "passport";

const router = express.Router();

const passportLogin = passport.authenticate("local", { session: false });
const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as AuthController from "../controllers/auth";
import "../config/passport";


router.post(
    "/facebookToken",
    passport.authenticate("facebookToken", {
        session: false
    }),
    AuthController.facebookOAuth
);

router.post("/register", AuthController.register);

router.get("/verify/:token", AuthController.verify);

router.post("/login", passportLogin, AuthController.login);

export { router }