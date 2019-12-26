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
const ChatController = __importStar(require("../controllers/chat"));
router.get("/conversations", passportJWTverify, ChatController.getConversations);
router.get("/conversations/:id", passportJWTverify, ChatController.getMessages);
router.get("/info/:id", passportJWTverify, ChatController.getInfo);
router.post("/send", passportJWTverify, ChatController.sendTextMessage);
//# sourceMappingURL=chat.js.map