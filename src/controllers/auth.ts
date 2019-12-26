import { Request, Response, NextFunction } from "express";

import Joi from "joi";
import { authSchema } from "../validationSchemas/auth";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import randomstring from "randomstring";
import { config } from "../config/config";
import { sendEmail } from "../config/mailer";

import { User } from "../models/User";
import { createNewProfile } from "../repository/profile";
import { Profile } from "../models/Profile";

const signToken = (user: Express.User) => {
    return jsonwebtoken.sign(
        {
            iss: "DietApp",
            sub: user.id,
            iat: new Date().getTime(), // current time
            exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
        },
        process.env.JWT_KEY
    );
};

const register = (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = Joi.validate(req.body, authSchema);

        if (result.error) {
            return res.status(400).json(result.error);
        }

        const { email, password, displayName, accountType } = req.body;
        User.findOne({ where: { email: email, authType: "LOCAL" } }).then(user => {
            if (!user) {
                bcryptjs.hash(password, 10, (hashErr, hash) => {
                    if (hashErr) {
                        return res.status(500).json({ err: hashErr, message: "Password hashing error" });
                    }
                    const secretToken = randomstring.generate();

                    User.create({
                        email: email,
                        passwd: hash,
                        authType: "LOCAL",
                        displayName: displayName,
                        accountVerificationToken: secretToken,
                        accountType: accountType
                    })
                        .then(async newUser => {
                            if (accountType === 'doctor') {
                                await createNewProfile(newUser.id);
                            }

                            const activationLink = config.CLIENT_URI + "/auth/verify/" + secretToken;

                            const html = `
                                        <b>Witaj w aplikacji</b>
                                        <p>Kliknij w poniższy link aby dokończyć rejestrację!</p>
                                        <a href="${activationLink}">Aktywuj moje konto</a>
                                        <hr>`;
                            sendEmail(config.APP_EMAIL_ADDRESS, newUser.email, "Dokończ rejestrację", html)
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
                        })
                        .catch(err => {
                            return res.status(500).json({ err: err, message: "User creation error" });
                        });
                });
            } else {
                return res.status(409).json({ message: "User with such email already have local account." });
            }
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
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

        await Profile.findOne({ where: { ownerId: user.id } }).then(profile => {
            if (profile) {
                userInfo.profileId = profile.id;
            }
        });

        return res.status(200).json({
            message: "Auth successful",
            token: token,
            user: userInfo
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
};

const verify = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    try {
        User.findOne({ where: { accountVerificationToken: token, authType: "LOCAL" } }).then(user => {
            if (user === null) {
                return res.status(404);
            }

            user.update({ isActive: true, accountVerificationToken: "" }).then(() => {
                return res.status(200).json({ message: "Successfully verified account" });
            });
        });
    } catch (e) {
        return res.status(500).json({ err: e });
    }
};

const facebookOAuth = async (req: Request, res: Response, next: NextFunction) => {
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
};

export { register, login, verify, facebookOAuth };