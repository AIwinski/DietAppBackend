import express from "express";
import passport from "passport";

const router = express.Router();

const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as ChatController from "../controllers/chat";

router.get("/conversations", passportJWTverify, ChatController.getConversations);

router.get("/conversations/:id", passportJWTverify, ChatController.getMessages);

router.get("/info/:id", passportJWTverify, ChatController.getInfo);

router.post("/send", passportJWTverify, ChatController.sendTextMessage);

export { router }