"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const authSchema = joi_1.default.object().keys({
    email: joi_1.default.string()
        .email()
        .required(),
    password: joi_1.default.string()
        .min(6)
        .max(100)
        .required(),
    displayName: joi_1.default.string()
        .min(2)
        .max(100)
        .required(),
    accountType: joi_1.default.string().only(['doctor', 'patient'])
});
exports.authSchema = authSchema;
//# sourceMappingURL=auth.js.map