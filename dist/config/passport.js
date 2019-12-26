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
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_facebook_token_1 = __importDefault(require("passport-facebook-token"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const User_1 = require("../models/User");
const JwtStrategy = passport_jwt_1.default.Strategy;
const LocalStrategy = passport_local_1.default.Strategy;
// const GoogleTokenStrategy = require("passport-google-token");
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY,
    passReqToCallback: true
}, (req, payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user specified in token
        User_1.User.findOne({ where: { id: payload.sub } }).then((user) => {
            if (!user) {
                return done(null, false);
            }
            req.user = user.dataValues;
            done(null, user);
        });
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.use(new LocalStrategy({
    usernameField: "email"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        User_1.User.findOne({ where: { email: email, authType: "LOCAL" } }).then((user) => {
            if (!user) {
                return done(null, false);
            }
            user = user.dataValues;
            bcryptjs_1.default.compare(password, user.passwd, (err, result) => {
                if (err) {
                    console.log(err);
                    return done(null, false);
                }
                if (result === false) {
                    return done(null, false);
                }
                if (user.isActive === false) {
                    return done(null, false);
                }
                done(null, user);
            });
        });
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.use("facebookToken", new passport_facebook_token_1.default({
    clientID: process.env.AUTH_FACEBOOK_ID,
    clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        User_1.User.findOne({ where: { authType: "EXTERNAL", authProvider: "facebook", externalProviderId: profile.id, accountType: 'patient' } }).then((user) => {
            if (user) {
                user.update({
                    displayName: profile.displayName,
                    avatar: profile.photos.length > 0 ? profile.photos[0].value : ""
                }).then((updatedUser) => {
                    delete updatedUser.dataValues.password;
                    req.user = updatedUser.dataValues;
                    done(null, updatedUser.dataValues);
                });
            }
            else {
                User_1.User.create({
                    email: profile.emails[0].value,
                    externalProviderId: profile.id,
                    authProvider: "facebook",
                    password: null,
                    authType: "EXTERNAL",
                    displayName: profile.displayName,
                    accountVerificationToken: null,
                    isActive: true,
                    avatar: profile.photos.length > 0 ? profile.photos[0].value : "",
                    accountType: 'patient'
                }).then((newUser) => {
                    delete newUser.dataValues.password;
                    req.user = newUser.dataValues;
                    done(null, newUser.dataValues);
                });
            }
        });
    }
    catch (error) {
        done(error, false, error.message);
    }
})));
//# sourceMappingURL=passport.js.map