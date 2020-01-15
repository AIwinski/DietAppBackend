import express from "express";
import passport from "passport";

const router = express.Router();

const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as PatientController from "../controllers/patient";

router.get("/", passportJWTverify, PatientController.getPatientList);

router.post("/", passportJWTverify, PatientController.addPatient);

router.get("/note", passportJWTverify, PatientController.getNotes);
router.get("/note/:id", passportJWTverify, PatientController.getNotes);
router.post("/note", passportJWTverify, PatientController.addNote);
router.delete("/note/:id", passportJWTverify, PatientController.deleteNote);

router.get("/data-set/:id", passportJWTverify, PatientController.getDataSets);
router.post("/data-set/:id", passportJWTverify, PatientController.addDataSet);
router.delete("/data-set/:id", passportJWTverify, PatientController.removeDataSet);

router.post("/data-value", passportJWTverify, PatientController.addDataValue);
router.delete("/data-value/:id", passportJWTverify, PatientController.removeDataValue);

router.get("/:id", passportJWTverify, PatientController.getPatient);





export { router }