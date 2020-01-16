"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
exports.router = router;
const passportJWTverify = passport_1.default.authenticate("jwt", { session: false });
const PatientController = __importStar(require("../controllers/patient"));
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
//# sourceMappingURL=patient.js.map