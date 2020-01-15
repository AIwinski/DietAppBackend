import express from "express";
import passport from "passport";

const router = express.Router();

const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as PatientController from "../controllers/patient";

router.get("/:id", passportJWTverify, PatientController.getUser);



export { router }