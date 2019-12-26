"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const auth_1 = require("../validationSchemas/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const randomstring_1 = __importDefault(require("randomstring"));
const config_1 = require("../config/config");
const mailer_1 = require("../config/mailer");
const User_1 = require("../models/User");
const profile_1 = require("../repository/profile");
const Profile_1 = require("../models/Profile");
const signToken = (user) => {
    return jsonwebtoken_1.default.sign({
        iss: "DietApp",
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    }, process.env.JWT_KEY);
};
const register = (req, res, next) => {
    try {
        const result = joi_1.default.validate(req.body, auth_1.authSchema);
        if (result.error) {
            return res.status(400).json(result.error);
        }
        const { email, password, displayName, accountType } = req.body;
        User_1.User.findOne({ where: { email: email, authType: "LOCAL" } }).then(user => {
            if (!user) {
                bcryptjs_1.default.hash(password, 10, (hashErr, hash) => {
                    if (hashErr) {
                        return res.status(500).json({ err: hashErr, message: "Password hashing error" });
                    }
                    const secretToken = randomstring_1.default.generate();
                    User_1.User.create({
                        email: email,
                        passwd: hash,
                        authType: "LOCAL",
                        displayName: displayName,
                        accountVerificationToken: secretToken,
                        accountType: accountType
                    })
                        .then((newUser) => __awaiter(void 0, void 0, void 0, function* () {
                        if (accountType === 'doctor') {
                            yield profile_1.createNewProfile(newUser.id);
                        }
                        const activationLink = config_1.config.CLIENT_URI + "/auth/verify/" + secretToken;
                        const html = `
                                        <b>Witaj w aplikacji</b>
                                        <p>Kliknij w poniższy link aby dokończyć rejestrację!</p>
                                        <a href="${activationLink}">Aktywuj moje konto</a>
                                        <hr>`;
                        mailer_1.sendEmail(config_1.config.APP_EMAIL_ADDRESS, newUser.email, "Dokończ rejestrację", html)
                            .then(r => {
                            return res.status(201).json({
                                message: "User created successfully. Confirmation mail sent successfully",
                                user: newUser
                            });
                        })
                            .catch(e => {
                            return res.status(500).json({
                                error: e,
                                message: "User created successfully but couldnt send email"
                            });
                        });
                    }))
                        .catch(err => {
                        return res.status(500).json({ err: err, message: "User creation error" });
                    });
                });
            }
            else {
                return res.status(409).json({ message: "User with such email already have local account." });
            }
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
};
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const token = signToken(user);
        const userInfo = {
            id: user.id,
            displayName: user.displayName,
            avatar: user.avatar,
            email: user.email,
            accountType: user.accountType,
            profileId: ""
        };
        yield Profile_1.Profile.findOne({ where: { ownerId: user.id } }).then(profile => {
            if (profile) {
                userInfo.profileId = profile.id;
            }
        });
        return res.status(200).json({
            message: "Auth successful",
            token: token,
            user: userInfo
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
});
exports.login = login;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        User_1.User.findOne({ where: { accountVerificationToken: token, authType: "LOCAL" } }).then(user => {
            if (user === null) {
                return res.status(404);
            }
            user.update({ isActive: true, accountVerificationToken: "" }).then(() => {
                return res.status(200).json({ message: "Successfully verified account" });
            });
        });
    }
    catch (e) {
        return res.status(500).json({ err: e });
    }
});
exports.verify = verify;
const facebookOAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const token = signToken(user);
    const userInfo = {
        id: user.id,
        displayName: user.displayName,
        avatar: user.avatar,
        email: user.email,
        accountType: user.accountType
    };
    return res.status(200).json({
        message: "Auth successful",
        token: token,
        user: userInfo
    });
});
exports.facebookOAuth = facebookOAuth;
//# sourceMappingURL=auth.js.map