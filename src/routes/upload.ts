import express from "express";
import passport from "passport";

const router = express.Router();

const passportJWTverify = passport.authenticate("jwt", { session: false });

import * as UploadController from "../controllers/upload";

router.post("/avatar", passportJWTverify, UploadController.uploadAvatar);

router.post("/image", passportJWTverify, UploadController.uploadImage);

router.post("/file", passportJWTverify, UploadController.uploadFile)

router.get("/file/:messageId", passportJWTverify, UploadController.downloadFile);

export { router }
