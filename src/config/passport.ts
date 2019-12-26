import passport from "passport";
import bcryptjs from "bcryptjs";
import FacebookTokenStrategy from "passport-facebook-token";
import passportJwt from "passport-jwt";
import passportLocal from "passport-local";
import { User } from "../models/User";

const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = passportLocal.Strategy;

// const GoogleTokenStrategy = require("passport-google-token");


passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_KEY,
            passReqToCallback: true
        },
        async (req: any, payload: any, done: any) => {
            try {
                // Find the user specified in token
                User.findOne({ where: { id: payload.sub } }).then((user: any) => {
                    if (!user) {
                        return done(null, false);
                    }
                    req.user = user.dataValues;
                    done(null, user);
                });
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: "email"
        },
        async (email, password, done) => {
            try {
                User.findOne({ where: { email: email, authType: "LOCAL" } }).then((user: any) => {
                    if (!user) {
                        return done(null, false);
                    }
                    user = user.dataValues;

                    bcryptjs.compare(password, user.passwd, (err, result) => {
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
            } catch (error) {
                done(error, false);
            }
        }
    )
);

passport.use(
    "facebookToken",
    new FacebookTokenStrategy(
        {
            clientID: process.env.AUTH_FACEBOOK_ID,
            clientSecret: process.env.AUTH_FACEBOOK_SECRET,
            passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                User.findOne({ where: { authType: "EXTERNAL", authProvider: "facebook", externalProviderId: profile.id, accountType: 'patient' } }).then(
                    (user: any) => {
                        if (user) {
                            user.update({
                                displayName: profile.displayName,
                                avatar: profile.photos.length > 0 ? profile.photos[0].value : ""
                            }).then((updatedUser: any) => {
                                delete updatedUser.dataValues.password;
                                req.user = updatedUser.dataValues;
                                done(null, updatedUser.dataValues);
                            });
                        } else {
                            User.create({
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
                            }).then((newUser: any) => {
                                delete newUser.dataValues.password;
                                req.user = newUser.dataValues;
                                done(null, newUser.dataValues);
                            });
                        }
                    }
                );
            } catch (error) {
                done(error, false, error.message);
            }
        }
    )
);