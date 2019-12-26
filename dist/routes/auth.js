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
const passportLogin = passport_1.default.authenticate("local", { session: false });
const passportJWTverify = passport_1.default.authenticate("jwt", { session: false });
const AuthController = __importStar(require("../controllers/auth"));
require("../config/passport");
router.post("/facebookToken", passport_1.default.authenticate("facebookToken", {
    session: false
}), AuthController.facebookOAuth);
router.post("/register", AuthController.register);
router.get("/verify/:token", AuthController.verify);
router.post("/login", passportLogin, AuthController.login);
//# sourceMappingURL=auth.js.map