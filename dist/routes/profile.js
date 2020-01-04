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
const ProfileController = __importStar(require("../controllers/profile"));
router.get("/", ProfileController.getProfiles);
router.post("/", passportJWTverify, ProfileController.addNewProfile);
router.post("/price-list-element", passportJWTverify, ProfileController.addPriceListElement);
router.delete("/price-list-element/:id", passportJWTverify, ProfileController.deletePriceListElement);
router.put("/user", passportJWTverify, ProfileController.updateUser);
router.get("/avatar-reset", passportJWTverify, ProfileController.resetAvatar);
router.post("/review", passportJWTverify, ProfileController.addReview);
router.delete("/image/:id", passportJWTverify, ProfileController.deleteImage);
router.get("/search/:phrase", ProfileController.search);
router.get("/:id", ProfileController.getProfileById);
router.put("/:id", passportJWTverify, ProfileController.updateProfile);
//# sourceMappingURL=profile.js.map